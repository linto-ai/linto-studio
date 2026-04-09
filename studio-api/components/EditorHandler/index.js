const debug = require("debug")("linto:components:EditorHandler")
const Component = require("../component.js")
const { Hocuspocus } = require("@hocuspocus/server")
const { WebSocketServer } = require("ws")

class EditorHandler extends Component {
  constructor(app) {
    super(app, "WebServer")
    this.id = this.constructor.name
    this.app = app
    this.lastFlushedTurns = new Map()

    const httpServer = this.app.components["WebServer"].httpServer
    if (!httpServer) {
      throw new Error("EditorHandler requires WebServer.httpServer")
    }

    const self = this
    this.hocuspocus = new Hocuspocus({
      name: "linto-editor",
      debounce: 10000,
      maxDebounce: 30000,
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
      async afterUnloadDocument({ documentName }) {
        self.lastFlushedTurns.delete(documentName)
        debug(`Unloaded doc=${documentName}, cleared cache`)
      },
    })

    // WebSocket server in noServer mode for manual upgrade
    this.wss = new WebSocketServer({ noServer: true })

    httpServer.on("upgrade", (request, socket, head) => {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`)
        if (url.pathname.startsWith("/ws/editor/")) {
          this.wss.handleUpgrade(request, socket, head, (ws) => {
            this.hocuspocus.handleConnection(ws, request)
          })
        }
        // Otherwise: socket.io or other handlers take care of it
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
    const { verifyJwtStandalone } = require(
      `${process.cwd()}/components/WebServer/config/passport/jwt`,
    )
    const { hasWriteAccess } = require(
      `${process.cwd()}/components/WebServer/middlewares/access/conversationAccess`,
    )

    debug(`onAuthenticate: doc=${documentName}`)
    const userData = await verifyJwtStandalone(token)
    if (!userData) {
      throw new Error("Unauthorized")
    }

    const canWrite = await hasWriteAccess(documentName, userData.userId)
    if (!canWrite) {
      throw new Error("Forbidden")
    }

    return { userId: userData.userId, canWrite }
  }

  async _onLoadDocument({ document, documentName, context }) {
    const model = require(`${process.cwd()}/lib/mongodb/models`)
    const { seedYDoc } = require("./schema/seedYDoc")

    debug(`onLoadDocument: doc=${documentName} user=${context?.userId}`)

    const conversation = await model.conversations.getById(documentName)
    if (!conversation || conversation.length !== 1) {
      throw new Error(`Conversation ${documentName} not found`)
    }

    const turns = conversation[0].text || []

    // Store the full turns (with words) in memory for diff in onStoreDocument
    this.lastFlushedTurns.set(documentName, turns)

    seedYDoc(document, turns)
    return document
  }

  async _onStoreDocument({ document, documentName }) {
    const model = require(`${process.cwd()}/lib/mongodb/models`)
    const { docToTurns } = require("./schema/docToTurns")
    const { computeDiff } = require("./flush/diff")

    const newTurns = docToTurns(document)
    const oldTurns = this.lastFlushedTurns.get(documentName) || []

    const diff = computeDiff(oldTurns, newTurns)

    if (
      diff.updates.length === 0 &&
      diff.additions.length === 0 &&
      diff.deletions.length === 0
    ) {
      return
    }

    try {
      for (const turn of diff.updates) {
        await model.conversations.updateTurnAtomic(
          documentName,
          turn.turn_id,
          turn,
        )
      }
      for (const turn of diff.additions) {
        await model.conversations.addTurnAtomic(documentName, turn)
      }
      for (const turnId of diff.deletions) {
        await model.conversations.removeTurnAtomic(documentName, turnId)
      }

      this.lastFlushedTurns.set(documentName, newTurns)
      debug(
        `Flushed doc=${documentName}: ${diff.updates.length}U ${diff.additions.length}A ${diff.deletions.length}D`,
      )
    } catch (err) {
      console.error(`Flush failed for doc=${documentName}:`, err)
      // Don't update lastFlushedTurns — will retry on next flush
    }
  }
}

module.exports = (app) => new EditorHandler(app)
