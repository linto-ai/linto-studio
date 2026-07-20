const debug = require("debug")("linto:components:EditorHandler")
const Component = require("../component.js")
const { Hocuspocus } = require("@hocuspocus/server")
const { WebSocketServer } = require("ws")

const { onAuthenticate } = require("./hooks/onAuthenticate")
const { beforeHandleMessage } = require("./hooks/beforeHandleMessage")
const { onLoadDocument } = require("./hooks/onLoadDocument")
const { onStoreDocument } = require("./hooks/onStoreDocument")
const { onStateless } = require("./hooks/onStateless")

class EditorHandler extends Component {
  constructor(app) {
    super(app, "WebServer")
    this.id = this.constructor.name
    this.app = app

    const httpServer = this.app.components["WebServer"].httpServer
    if (!httpServer) {
      throw new Error("EditorHandler requires WebServer.httpServer")
    }

    this.hocuspocus = new Hocuspocus({
      name: "linto-editor",
      debounce: 5000,
      maxDebounce: 15000,
      quiet: true,
      extensions: this.buildExtensions(),

      onAuthenticate,
      beforeHandleMessage,
      onLoadDocument,
      onStateless,
      onStoreDocument: (data) =>
        onStoreDocument(data, (documentName) =>
          this.hocuspocus.closeConnections(documentName),
        ),
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
}

module.exports = (app) => new EditorHandler(app)
