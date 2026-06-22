const debug = require("debug")("linto:components:EditorHandler")
const Component = require("../component.js")
const { Hocuspocus } = require("@hocuspocus/server")
const { WebSocketServer } = require("ws")
const Y = require("yjs")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { verifyAuthToken } = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
const { hasAccess } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)
const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)
const { seedYDoc } = require("./schema/seedYDoc")
const { seedSpeakers } = require("./schema/seedSpeakers")
const { docToTurns } = require("./schema/docToTurns")
const { docToSpeakers } = require("./schema/docToSpeakers")
const { enrichDiff } = require("./flush/enrichDiff")
const { speakersChanged } = require("./flush/speakersDiff")

// Document names are "<conversationId>.<editorEpoch>". The epoch makes the
// CRDT history lineage part of the document identity: a client holding a
// Y.Doc from a previous lineage (history rebuilt after an external write)
// targets a different document name and is rejected at authentication,
// instead of merging two incompatible histories.
function parseDocumentName(documentName) {
  const dot = documentName.lastIndexOf(".")
  if (dot === -1) return null
  const conversationId = documentName.slice(0, dot)
  const epoch = Number(documentName.slice(dot + 1))
  if (!conversationId || !Number.isInteger(epoch) || epoch < 0) return null
  return { conversationId, epoch }
}

// Mongo returns the persisted Yjs state as a BSON Binary; Yjs wants a Uint8Array.
function binaryToUint8(state) {
  if (state instanceof Uint8Array) return state
  if (state && state.buffer) return new Uint8Array(state.buffer)
  return null
}

// Words+timestamps live outside the Y.Doc; delivered as a stateless message.
function buildWordsPayload(turns) {
  return (turns || [])
    .filter((t) => Array.isArray(t.words) && t.words.length > 0)
    .map((t) => ({ turn_id: t.turn_id, words: t.words }))
}

const EMPTY_WORDS = []

// Words compared by reference: enrichDiff reuses the old array when a turn is
// unchanged and allocates a new one when it recomputes (O(1), no false miss).
function turnPersistDiffers(a, b) {
  return (
    (a.segment ?? "") !== (b.segment ?? "") ||
    (a.raw_segment ?? "") !== (b.raw_segment ?? "") ||
    (a.speaker_id ?? null) !== (b.speaker_id ?? null) ||
    (a.language ?? "") !== (b.language ?? "") ||
    (a.words ?? EMPTY_WORDS) !== (b.words ?? EMPTY_WORDS)
  )
}

// Turns to update in place (by turn_id) when the set/order is unchanged; null
// when the structure changed (add/remove/reorder) so the array must be rewritten.
function inPlaceDirtyTurns(oldTurns, newTurns) {
  if (oldTurns.length !== newTurns.length) return null
  const seen = new Set()
  const dirty = []
  for (let i = 0; i < newTurns.length; i++) {
    const id = newTurns[i].turn_id
    // Missing/duplicate id → arrayFilter on text.$[elem] is ambiguous; rewrite all.
    if (!id || seen.has(id)) return null
    seen.add(id)
    if (oldTurns[i].turn_id !== id) return null
    if (turnPersistDiffers(oldTurns[i], newTurns[i])) dirty.push(newTurns[i])
  }
  return dirty
}

class EditorHandler extends Component {
  // Max time a revoked WRITE right stays effective on an active connection
  // before _beforeHandleMessage re-checks against Mongo.
  static RIGHTS_RECHECK_MS = 300000

  // Initial words+timestamps are sent in chunks of this many turns, not one frame.
  static TIMESTAMPS_CHUNK_TURNS = 50

  constructor(app) {
    super(app, "WebServer")
    this.id = this.constructor.name
    this.app = app

    const httpServer = this.app.components["WebServer"].httpServer
    if (!httpServer) {
      throw new Error("EditorHandler requires WebServer.httpServer")
    }

    const self = this
    this.hocuspocus = new Hocuspocus({
      name: "linto-editor",
      debounce: 5000,
      maxDebounce: 15000,
      quiet: true,
      extensions: this.buildExtensions(),

      async onAuthenticate(data) {
        return self._onAuthenticate(data)
      },
      async beforeHandleMessage(data) {
        return self._beforeHandleMessage(data)
      },
      async onLoadDocument(data) {
        return self._onLoadDocument(data)
      },
      async onStoreDocument(data) {
        return self._onStoreDocument(data)
      },
      async onStateless(data) {
        return self._onStateless(data)
      },
    })

    // WebSocket server in noServer mode: WebServer's upgrade router hands us the
    // raw socket for /ws/editor and we complete the handshake here.
    this.wss = new WebSocketServer({ noServer: true })

    this.app.components["WebServer"].registerUpgradeHandler(
      "/ws/editor",
      (request, socket, head) => {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.hocuspocus.handleConnection(ws, request)
        })
      },
    )

    debug("EditorHandler ready on /ws/editor/*")
    return this.init()
  }

  buildExtensions() {
    const extensions = []
    const redisHost = process.env.SOCKETIO_REDIS_HOST
    if (redisHost) {
      try {
        const { Redis } = require("@hocuspocus/extension-redis")
        extensions.push(
          new Redis({
            host: redisHost,
            port: Number(process.env.SOCKETIO_REDIS_PORT || 6379),
            options: {
              password: process.env.SOCKETIO_REDIS_PASSWORD || undefined,
            },
            prefix: "hocuspocus:",
          }),
        )
        debug(`Redis extension enabled at ${redisHost}`)
      } catch (err) {
        debug(`Failed to load Redis extension: ${err.message}`)
      }
    } else {
      debug("Redis extension disabled — single-instance mode")
    }
    return extensions
  }

  // --- Hooks ---

  async _onAuthenticate({ token, documentName, connectionConfig }) {
    debug(`onAuthenticate: doc=${documentName}`)
    const parsed = parseDocumentName(documentName)
    if (!parsed) {
      throw new Error("Invalid document name")
    }
    const { conversationId, epoch } = parsed

    const userData = await verifyAuthToken(token)
    if (!userData) {
      throw new Error("Unauthorized")
    }

    const canWrite = await hasAccess(
      conversationId,
      userData.userId,
      CONVERSATION_RIGHTS.WRITE,
    )
    if (!canWrite) {
      const canRead = await hasAccess(
        conversationId,
        userData.userId,
        CONVERSATION_RIGHTS.READ,
      )
      if (!canRead) {
        throw new Error("Forbidden")
      }
      // Read-only access: the client receives live updates but the server
      // rejects any edit coming from this connection.
      connectionConfig.readOnly = true
    }

    // Reject connections targeting a dead history lineage: the client must
    // refetch the conversation (fresh epoch) and rebuild its Y.Doc.
    const conversation = await model.conversations.getById(conversationId, [
      "editorEpoch",
    ])
    if (!conversation || conversation.length !== 1) {
      throw new Error(`Conversation ${conversationId} not found`)
    }
    const currentEpoch = conversation[0].editorEpoch ?? 0
    if (epoch !== currentEpoch) {
      debug(
        `onAuthenticate: stale epoch doc=${documentName} current=${currentEpoch}`,
      )
      throw new Error("Stale editor epoch")
    }

    return { userId: userData.userId, canWrite, conversationId }
  }

  // Re-validate write rights on incoming edits. onAuthenticate only runs at
  // connect, so a user whose WRITE right is revoked mid-session would otherwise
  // keep editing until they disconnect. Read-only connections can't write, so
  // they need no re-check. A per-connection TTL bounds the revocation window
  // without hitting Mongo on every keystroke.
  async _beforeHandleMessage({ documentName, context, connection }) {
    if (!connection || connection.readOnly) return
    if (!context || !context.userId) return

    const now = Date.now()
    if (
      context.rightsCheckedAt &&
      now - context.rightsCheckedAt < EditorHandler.RIGHTS_RECHECK_MS
    ) {
      return
    }

    const conversationId =
      context.conversationId ?? parseDocumentName(documentName)?.conversationId
    const stillCanWrite = await hasAccess(
      conversationId,
      context.userId,
      CONVERSATION_RIGHTS.WRITE,
    )
    if (!stillCanWrite) {
      // Write right revoked since connect. Reject the message: Hocuspocus
      // closes the connection. The client may reconnect and will then be
      // re-evaluated by _onAuthenticate (read-only or forbidden).
      debug(
        `beforeHandleMessage: write revoked doc=${documentName} user=${context.userId}, closing`,
      )
      throw new Error("Write access revoked")
    }
    context.rightsCheckedAt = now
  }

  async _onLoadDocument({ document, documentName, context }) {
    debug(`onLoadDocument: doc=${documentName} user=${context?.userId}`)
    const parsed = parseDocumentName(documentName)
    if (!parsed) {
      throw new Error("Invalid document name")
    }
    const { conversationId, epoch } = parsed

    const conversation = await model.conversations.getById(conversationId, [
      "text",
      "speakers",
      "editorEpoch",
    ])
    if (!conversation || conversation.length !== 1) {
      throw new Error(`Conversation ${conversationId} not found`)
    }

    // Epoch may have been bumped between authentication and load: refuse,
    // the client reconnects and gets the stale-epoch rejection at auth.
    const currentEpoch = conversation[0].editorEpoch ?? 0
    if (epoch !== currentEpoch) {
      throw new Error("Stale editor epoch")
    }

    const turns = conversation[0].text || []
    const speakers = conversation[0].speakers || []

    const stored = await model.editorStates.get(conversationId)
    const storedState =
      stored && stored.epoch === epoch ? binaryToUint8(stored.state) : null

    if (storedState) {
      // Replay the persisted CRDT state: the history lineage stays
      // continuous, so clients reconnecting with an older replica of the
      // same lineage merge cleanly (their state is a prefix of ours, or
      // they hold ops we lost and resend them).
      Y.applyUpdate(document, storedState)
      debug(`onLoadDocument: doc=${documentName} restored persisted state`)
    } else {
      // First load of this lineage: seed from Mongo turns. Never reseed an
      // existing lineage — the fixed seed clientID with different content
      // would collide with the ops clients already hold.
      seedYDoc(document, turns)
      seedSpeakers(document, speakers)
    }

    // Epoch this in-memory doc belongs to; flush writes are guarded with it.
    document.lintoEpoch = epoch
    // One-shot seed consumed by the first words request (avoids re-reading `text`).
    document.lintoWordsSeed = buildWordsPayload(turns)
    return document
  }

  async _onStateless({ payload, documentName, document, connection }) {
    // The Y.Doc carries segments only — words+timestamps are delivered through
    // stateless messages, on client request. The client asks once its store is
    // hydrated from the Y.Doc sync (pushing at connect raced that hydration:
    // a payload arriving first was dropped, turn ids not found in the store).
    if (!connection) return

    let msg
    try {
      msg = JSON.parse(payload)
    } catch (err) {
      return
    }
    if (!msg || msg.type !== "request_words") return

    try {
      let turnsWithWords = document?.lintoWordsSeed

      if (turnsWithWords) {
        // Consume the one-shot seed (first request after a cold load).
        delete document.lintoWordsSeed
      } else {
        // Later joiner: read fresh so words reflect edits since load.
        const conversationId = parseDocumentName(documentName)?.conversationId
        if (!conversationId) return
        const conversation = await model.conversations.getById(
          conversationId,
          ["text"],
        )
        if (!conversation || conversation.length !== 1) return
        turnsWithWords = buildWordsPayload(conversation[0].text || [])
      }

      if (!turnsWithWords || turnsWithWords.length === 0) return

      await this._sendTimestampsChunked(
        connection,
        documentName,
        turnsWithWords,
      )
    } catch (err) {
      debug(`request_words failed for doc=${documentName}: ${err.message}`)
    }
  }

  // Send timestamps in several smaller stateless messages, yielding between
  // chunks so a large transcript doesn't block the loop or send one huge frame.
  async _sendTimestampsChunked(connection, documentName, turnsWithWords) {
    const size = EditorHandler.TIMESTAMPS_CHUNK_TURNS
    const total = turnsWithWords.length
    for (let i = 0; i < total; i += size) {
      const chunk = turnsWithWords.slice(i, i + size)
      connection.sendStateless(
        JSON.stringify({
          type: "timestamps_recalc",
          turns: chunk,
        }),
      )
      if (i + size < total) {
        await new Promise((resolve) => setImmediate(resolve))
      }
    }
    debug(
      `Seeded words for doc=${documentName}: ${total} turns in ${Math.ceil(
        total / size,
      )} chunk(s)`,
    )
  }

  async _onStoreDocument({ document, documentName }) {
    const parsed = parseDocumentName(documentName)
    if (!parsed) return
    const { conversationId } = parsed
    const epoch = document.lintoEpoch ?? 0

    // Fresh read from Mongo: cross-instance source of truth for words+timestamps.
    // Protected by Hocuspocus extension-redis Redlock — only one instance per doc.
    const conversation = await model.conversations.getById(conversationId, [
      "text",
      "speakers",
    ])
    if (!conversation || conversation.length !== 1) {
      debug(`onStoreDocument: doc=${documentName} not found`)
      return
    }
    const oldTurns = conversation[0].text || []
    const oldSpeakers = (conversation[0].speakers || []).map((s) => ({
      speaker_id: s.speaker_id,
      speaker_name: s.speaker_name,
    }))

    // Synchronous block: turns, speakers and binary state are all extracted
    // from the exact same Y.Doc snapshot (no await in between), so the
    // persisted state never lags behind the turns written below.
    const newTurns = docToTurns(document)
    const newSpeakers = docToSpeakers(document)
    const yState = Buffer.from(Y.encodeStateAsUpdate(document))

    const { finalTurns, changedTurns, hasChanges } = enrichDiff(
      oldTurns,
      newTurns,
    )
    const speakersDirty = speakersChanged(oldSpeakers, newSpeakers)

    try {
      // Persist the CRDT state BEFORE the domain writes: the invariant
      // "state >= text" must hold, otherwise a crash window would reload an
      // older state and the next flush would regress already-persisted text.
      // The state is tagged with the doc's epoch: if an external write bumped
      // the epoch meanwhile, this write is inert (ignored at load time).
      const stateResult = await model.editorStates.set(
        conversationId,
        epoch,
        yState,
      )
      if (typeof stateResult?.matchedCount !== "number") {
        // State write failed: abort the flush, Mongo keeps the previous
        // consistent (state, text) pair. Edits stay in the live doc.
        console.error(
          `Flush aborted for doc=${documentName}: editor state write failed`,
        )
        return
      }

      if (!hasChanges && !speakersDirty) return

      let writeMode = "none"
      if (hasChanges) {
        const dirtyTurns = inPlaceDirtyTurns(oldTurns, finalTurns)
        if (
          dirtyTurns &&
          dirtyTurns.length > 0 &&
          dirtyTurns.length * 2 <= finalTurns.length
        ) {
          // Few turns changed, structure intact: update just those in place.
          const result = await model.conversations.updateTurnsByIds(
            conversationId,
            dirtyTurns,
            epoch,
          )
          if (this._staleFlush(result, dirtyTurns.length + 1, documentName))
            return
          writeMode = `targeted(${dirtyTurns.length}/${finalTurns.length})`
        } else {
          // Structure changed or most turns touched: rewrite the whole array.
          const result = await model.conversations.replaceTurns(
            conversationId,
            finalTurns,
            epoch,
          )
          if (this._staleFlush(result, 1, documentName)) return
          writeMode = `full(${finalTurns.length})`
        }
      }
      if (speakersDirty) {
        const result = await model.conversations.updateSpeakers(
          conversationId,
          newSpeakers,
          epoch,
        )
        if (this._staleFlush(result, 1, documentName)) return
      }

      debug(
        `Flushed doc=${documentName}: ${writeMode} changed=${changedTurns.length} speakers=${speakersDirty ? "Y" : "N"}`,
      )

      if (changedTurns.length > 0) {
        try {
          document.broadcastStateless(
            JSON.stringify({
              type: "timestamps_recalc",
              turns: changedTurns,
            }),
          )
        } catch (err) {
          debug(
            `broadcastStateless failed for doc=${documentName}: ${err.message}`,
          )
        }
      }
    } catch (err) {
      // A DB write failure throws here: abort this flush but keep the live doc
      // and its connections — edits stay in the Y.Doc and the next debounced
      // flush retries. Only a genuine epoch miss (matchedCount === 0) closes
      // connections, via _staleFlush. The model write methods must therefore
      // throw on error, never return it (a returned Error has no matchedCount
      // and would be misread by _staleFlush as a dead lineage).
      console.error(`Flush failed for doc=${documentName}:`, err)
    }
  }

  // True when an epoch-guarded write did not fully apply: the conversation
  // was rewritten outside the editor (epoch bumped) — this doc's lineage is
  // dead. Close its connections; clients reconnect, get the stale-epoch
  // rejection at auth, refetch and rebuild on the new lineage.
  _staleFlush(result, expectedMatches, documentName) {
    if (
      typeof result?.matchedCount === "number" &&
      result.matchedCount >= expectedMatches
    ) {
      return false
    }
    debug(
      `onStoreDocument: stale epoch doc=${documentName} (matched=${result?.matchedCount}), closing connections`,
    )
    try {
      this.hocuspocus.closeConnections(documentName)
    } catch (err) {
      debug(`closeConnections failed for doc=${documentName}: ${err.message}`)
    }
    return true
  }
}

module.exports = (app) => new EditorHandler(app)
