const debug = require("debug")("linto:components:EditorHandler")
const Component = require("../component.js")
const { Hocuspocus } = require("@hocuspocus/server")
const { WebSocketServer } = require("ws")

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

// Words+timestamps are not carried by the Y.Doc (only segments are), so they
// are delivered to each client as a stateless message. Build that payload from
// MongoDB-format turns, keeping only the turns that actually have words.
function buildWordsPayload(turns) {
  return (turns || [])
    .filter((t) => Array.isArray(t.words) && t.words.length > 0)
    .map((t) => ({ turn_id: t.turn_id, words: t.words }))
}

// True when the persisted fields of a turn differ. Words are compared by value;
// any difference (incl. uncertainty) counts as changed so we never skip a real
// write.
function turnPersistDiffers(a, b) {
  return (
    (a.segment ?? "") !== (b.segment ?? "") ||
    (a.raw_segment ?? "") !== (b.raw_segment ?? "") ||
    (a.speaker_id ?? null) !== (b.speaker_id ?? null) ||
    (a.language ?? "") !== (b.language ?? "") ||
    JSON.stringify(a.words ?? []) !== JSON.stringify(b.words ?? [])
  )
}

// Returns the turns to update in place (matched by turn_id) when the turn set
// and order are unchanged between old and new, or null when the structure
// changed (add/remove/reorder/split/merge) and the whole array must be rewritten.
function inPlaceDirtyTurns(oldTurns, newTurns) {
  if (oldTurns.length !== newTurns.length) return null
  const dirty = []
  for (let i = 0; i < newTurns.length; i++) {
    if (oldTurns[i].turn_id !== newTurns[i].turn_id) return null
    if (turnPersistDiffers(oldTurns[i], newTurns[i])) dirty.push(newTurns[i])
  }
  return dirty
}

class EditorHandler extends Component {
  // Max time a revoked WRITE right stays effective on an active connection
  // before _beforeHandleMessage re-checks against Mongo.
  static RIGHTS_RECHECK_MS = 300000

  // Initial words+timestamps are delivered in chunks of this many turns rather
  // than one large frame: smaller WebSocket messages and the client applies
  // them progressively instead of in a single blocking burst.
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
      async connected(data) {
        return self._onConnected(data)
      },
    })

    // WebSocket server in noServer mode for manual upgrade
    this.wss = new WebSocketServer({ noServer: true })

    // IoHandler sets destroyUpgrade: false on socket.io so engine.io
    // won't destroy upgrade sockets on unrecognized paths.
    httpServer.on("upgrade", (request, socket, head) => {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`)
        if (url.pathname.startsWith("/ws/editor")) {
          this.wss.handleUpgrade(request, socket, head, (ws) => {
            this.hocuspocus.handleConnection(ws, request)
          })
        }
        // Otherwise: engine.io / socket.io handles it
      } catch (err) {
        debug("upgrade error:", err.message)
        socket.destroy()
      }
    })

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
    const userData = await verifyAuthToken(token)
    if (!userData) {
      throw new Error("Unauthorized")
    }

    const canWrite = await hasAccess(
      documentName,
      userData.userId,
      CONVERSATION_RIGHTS.WRITE,
    )
    if (!canWrite) {
      const canRead = await hasAccess(
        documentName,
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

    return { userId: userData.userId, canWrite }
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

    const stillCanWrite = await hasAccess(
      documentName,
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

    const conversation = await model.conversations.getById(documentName, [
      "text",
      "speakers",
    ])
    if (!conversation || conversation.length !== 1) {
      throw new Error(`Conversation ${documentName} not found`)
    }

    const turns = conversation[0].text || []
    const speakers = conversation[0].speakers || []

    seedYDoc(document, turns)
    seedSpeakers(document, speakers)

    // Stash the words payload so the first connection (which fires right after
    // this load) can deliver timestamps without re-reading `text`. Consumed
    // once in _onConnected; later joiners re-read fresh so edits stay current.
    document.lintoWordsSeed = buildWordsPayload(turns)
    return document
  }

  async _onConnected({ documentName, connection, instance }) {
    // Sent right after the Y.Doc sync state has been pushed to the new client.
    // The Y.Doc carries segments only — we need to deliver words+timestamps
    // through a separate stateless message, targeted to this connection.
    if (!connection) return

    try {
      const document = instance?.documents?.get(documentName)
      let turnsWithWords = document?.lintoWordsSeed

      if (turnsWithWords) {
        // One-shot seed from _onLoadDocument: the first connection after a cold
        // load reuses it instead of reading `text` a second time.
        delete document.lintoWordsSeed
      } else {
        // Document already in memory (later joiner): read fresh so word
        // timestamps reflect any edits flushed since the initial load.
        const conversation = await model.conversations.getById(documentName, [
          "text",
        ])
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
      debug(`onConnected seed failed for doc=${documentName}: ${err.message}`)
    }
  }

  // Send the initial timestamps payload as several smaller stateless messages.
  // Yields between chunks so a very large transcript neither blocks the event
  // loop nor arrives as one multi-megabyte frame; the client applies each chunk
  // as a separate onStateless tick.
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
    // Fresh read from Mongo: cross-instance source of truth for words+timestamps.
    // Protected by Hocuspocus extension-redis Redlock — only one instance per doc.
    const conversation = await model.conversations.getById(documentName, [
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

    const newTurns = docToTurns(document)
    const newSpeakers = docToSpeakers(document)

    const { finalTurns, changedTurns, hasChanges } = enrichDiff(
      oldTurns,
      newTurns,
    )
    const speakersDirty = speakersChanged(oldSpeakers, newSpeakers)

    if (!hasChanges && !speakersDirty) return

    try {
      let writeMode = "none"
      if (hasChanges) {
        const dirtyTurns = inPlaceDirtyTurns(oldTurns, finalTurns)
        if (
          dirtyTurns &&
          dirtyTurns.length > 0 &&
          dirtyTurns.length * 2 <= finalTurns.length
        ) {
          // Structure unchanged and only a minority of turns touched: update
          // just those in place instead of rewriting the whole text array.
          await model.conversations.updateTurnsByIds(documentName, dirtyTurns)
          writeMode = `targeted(${dirtyTurns.length}/${finalTurns.length})`
        } else {
          // Structure changed (add/remove/reorder/split/merge) or most turns
          // touched: rewrite the whole array (always correct).
          await model.conversations.replaceTurns(documentName, finalTurns)
          writeMode = `full(${finalTurns.length})`
        }
      }
      if (speakersDirty) {
        await model.conversations.updateSpeakers(documentName, newSpeakers)
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
      console.error(`Flush failed for doc=${documentName}:`, err)
    }
  }
}

module.exports = (app) => new EditorHandler(app)
