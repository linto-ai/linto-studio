const debug = require("debug")("linto:components:EditorHandler")
const Component = require("../component.js")
const { Hocuspocus } = require("@hocuspocus/server")
const { WebSocketServer } = require("ws")

class EditorHandler extends Component {
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

  async _onAuthenticate({ token, documentName }) {
    const { verifyAuthToken } = require(
      `${process.cwd()}/components/WebServer/config/passport/middleware`,
    )
    const { hasAccess } = require(
      `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
    )
    const CONVERSATION_RIGHTS = require(
      `${process.cwd()}/lib/dao/conversation/rights`,
    )

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
      throw new Error("Forbidden")
    }

    return { userId: userData.userId, canWrite }
  }

  async _onLoadDocument({ document, documentName, context }) {
    const model = require(`${process.cwd()}/lib/mongodb/models`)
    const { seedYDoc } = require("./schema/seedYDoc")
    const { seedSpeakers } = require("./schema/seedSpeakers")

    debug(`onLoadDocument: doc=${documentName} user=${context?.userId}`)

    const conversation = await model.conversations.getById(documentName)
    if (!conversation || conversation.length !== 1) {
      throw new Error(`Conversation ${documentName} not found`)
    }

    const turns = conversation[0].text || []
    const speakers = conversation[0].speakers || []

    seedYDoc(document, turns)
    seedSpeakers(document, speakers)
    return document
  }

  async _onConnected({ documentName, connection }) {
    // Sent right after the Y.Doc sync state has been pushed to the new client.
    // The Y.Doc carries segments only — we need to deliver words+timestamps
    // through a separate stateless message, targeted to this connection.
    if (!connection) return

    const model = require(`${process.cwd()}/lib/mongodb/models`)
    try {
      const conversation = await model.conversations.getById(documentName)
      if (!conversation || conversation.length !== 1) return

      const turnsWithWords = (conversation[0].text || [])
        .filter((t) => Array.isArray(t.words) && t.words.length > 0)
        .map((t) => ({ turn_id: t.turn_id, words: t.words }))

      if (turnsWithWords.length === 0) return

      connection.sendStateless(
        JSON.stringify({
          type: "timestamps_recalc",
          turns: turnsWithWords,
        }),
      )
      debug(
        `Seeded words for doc=${documentName}: ${turnsWithWords.length} turns`,
      )
    } catch (err) {
      debug(`onConnected seed failed for doc=${documentName}: ${err.message}`)
    }
  }

  async _onStoreDocument({ document, documentName }) {
    const model = require(`${process.cwd()}/lib/mongodb/models`)
    const { docToTurns } = require("./schema/docToTurns")
    const { docToSpeakers } = require("./schema/docToSpeakers")
    const { enrichDiff } = require("./flush/enrichDiff")
    const { speakersChanged } = require("./flush/speakersDiff")

    // Fresh read from Mongo: cross-instance source of truth for words+timestamps.
    // Protected by Hocuspocus extension-redis Redlock — only one instance per doc.
    const conversation = await model.conversations.getById(documentName)
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

    const { finalTurns, changedTurns, hasChanges } = enrichDiff(oldTurns, newTurns)
    const speakersDirty = speakersChanged(oldSpeakers, newSpeakers)

    if (!hasChanges && !speakersDirty) return

    try {
      if (hasChanges) {
        await model.conversations.replaceTurns(documentName, finalTurns)
      }
      if (speakersDirty) {
        await model.conversations.updateSpeakers(documentName, newSpeakers)
      }

      debug(
        `Flushed doc=${documentName}: turns=${finalTurns.length} changed=${changedTurns.length} speakers=${speakersDirty ? "Y" : "N"}`,
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
          debug(`broadcastStateless failed for doc=${documentName}: ${err.message}`)
        }
      }
    } catch (err) {
      console.error(`Flush failed for doc=${documentName}:`, err)
    }
  }
}

module.exports = (app) => new EditorHandler(app)
