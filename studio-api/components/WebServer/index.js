const Component = require(`../component.js`)
const fs = require("fs")
const debug = require("debug")(`linto:components:WebServer:index`)
const express = require("express")
const fileUpload = require("express-fileupload")
const passport = require("passport")
const bodyParser = require("body-parser")
const bytes = require("bytes")
const {
  ConversationFileTooLarge,
} = require("./error/exception/conversation")
const WebServerErrorHandler = require("./error/handler")
const cookieParser = require("cookie-parser")
const cookieSession = require("cookie-session")

const swaggerUi = require("swagger-ui-express")

let swaggerDocument = require("./apidoc/swagger.json")

const CORS = require("cors")
let corsOptions = null

if (process.env.CORS_ENABLED === "true") {
  const whitelistRaw = process.env.CORS_API_WHITELIST || ""

  if (whitelistRaw === "*") {
    corsOptions = { origin: "*" }
  } else if (whitelistRaw.length > 0) {
    const whitelistDomains = whitelistRaw.split(",").map((d) => d.trim())

    corsOptions = {
      origin: function (origin, callback) {
        if (!origin) {
          return callback(null, true)
        }

        const allowed = whitelistDomains.some((domain) =>
          origin.includes(domain),
        )

        if (allowed) {
          callback(null, true)
        } else {
          callback(new Error("Not allowed by CORS"))
        }
      },
    }
  }
}
class WebServer extends Component {
  constructor(app) {
    super(app)
    this.id = this.constructor.name
    this.app = app
    this.express = express()

    if (corsOptions) {
      this.express.use(CORS(corsOptions))
      this.express.options("*", CORS(corsOptions)) // allow cors settings to be enable for all routes
    }

    const cookieMiddleware = cookieSession({
      name: "oidc",
      keys: [process.env.WEBSERVER_SESSION_SECRET],
      maxAge: 5 * 60 * 1000, // 5 min,
      sameSite: "lax",
      secure: true,
      httpOnly: true,
    })

    this.express.use("/auth/oidc", cookieMiddleware)

    this.express.set("etag", false)
    this.express.set("trust proxy", true)

    this.express.use(
      bodyParser.json({
        limit: process.env.EXPRESS_SIZE_FILE_MAX,
        extended: true,
      }),
    )
    this.express.use(
      bodyParser.urlencoded({
        limit: process.env.EXPRESS_SIZE_FILE_MAX,
        extended: true,
      }),
    )
    this.express.use(cookieParser())

    const fileSizeLimit =
      bytes.parse(process.env.EXPRESS_SIZE_FILE_MAX) || 500 * 1024 * 1024

    this.express.use(
      fileUpload({
        uriDecodeFileNames: true,
        limits: { fileSize: fileSizeLimit },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
          next(
            new ConversationFileTooLarge(
              `File exceeds the maximum allowed size of ${bytes.format(fileSizeLimit)}`,
              {
                maxSize: bytes.format(fileSizeLimit),
                maxSizeBytes: fileSizeLimit,
              },
            ),
          )
        },
      }),
    )

    this.express.use(passport.initialize())

    this.express.use(
      "/media/pictures",
      express.static(
        `${process.env.VOLUME_FOLDER}/${process.env.VOLUME_PROFILE_PICTURE_PATH}`,
        {
          // Uploaded files must never execute in the application origin.
          setHeaders: (res) => {
            res.setHeader("X-Content-Type-Options", "nosniff")
            res.setHeader("Content-Security-Policy", "default-src 'none'")
          },
        },
      ),
    )

    this.httpServer = this.express.listen(
      process.env.WEBSERVER_HTTP_PORT,
      "0.0.0.0",
      (err) => {
        debug(` WebServer listening on : ${process.env.WEBSERVER_HTTP_PORT}`)
        if (err) throw err
      },
    )

    // WebServer is the single owner of the HTTP 'upgrade' event. WebSocket
    // components (IoHandler/socket.io) declare a path
    // prefix + handler via registerUpgradeHandler(); any unrouted upgrade is
    // destroyed immediately. This makes upgrade routing explicit and
    // deterministic instead of relying on engine.io's destroyUpgrade reaper (a
    // 1s, internal-detail safety net), and stops abandoned upgrade sockets from
    // leaking file descriptors.
    this.upgradeRoutes = []
    this._onUpgrade = this._onUpgrade.bind(this)

    require("./routes/router.js")(this) // Loads all defined routes
    WebServerErrorHandler.init(this) // Manage error from controllers

    // Initialize LLM WebSocket manager with app reference for IoHandler access
    const organizationWsManager = require("./controllers/llm/llm_ws")
    organizationWsManager.setApp(app)

    let api_host = "localhost"
    let base_path = "/"
    if (process.env.WEBSERVER_SWAGGER_HTTP_HOST)
      api_host = process.env.WEBSERVER_SWAGGER_HTTP_HOST
    if (process.env.WEBSERVER_HTTP_PORT)
      api_host += ":" + process.env.WEBSERVER_HTTP_PORT
    // if (process.env.WEBSERVER_SWAGGER_API_PATH) api_host += '/' + process.env.WEBSERVER_SWAGGER_API_PATH
    if (process.env.WEBSERVER_SWAGGER_API_PATH)
      base_path = "/" + process.env.WEBSERVER_SWAGGER_API_PATH

    swaggerDocument.definition.host = api_host
    swaggerDocument.definition.basePath = base_path
    swaggerDocument.definition.servers = [{ url: base_path }]

    swaggerDocument.definition.paths = require("./apidoc/index.js")
    swaggerDocument.definition.components = {
      ...swaggerDocument.definition.components,
      ...require("./apidoc/components/index.js"),
    }

    try {
      const availabelVersion = fs.readdirSync(
        `${process.cwd()}/components/WebServer/apidoc/components/schemas/`,
      )
      for (let version of availabelVersion) {
        // availabelVersion.forEach(version => {
        swaggerDocument.definition.components.schemas = {
          ...swaggerDocument.definition.components.schemas,
          ...require(`./apidoc/components/schemas/${version}/index.js`),
        }
        if (version === process.env.DB_MIGRATION_TARGET) break
      }
    } catch (err) {
      debug("Error while loading swagger schema")
      debug(err)
    }

    this.express.use(
      "/apidoc",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument.definition),
    )

    return this.init()
  }

  loadComponents(name, components) {
    this.app.components[name] = components
  }

  /**
   * Register a WebSocket upgrade handler for a path prefix. WebSocket
   * components call this instead of adding their own `httpServer.on("upgrade")`
   * listener, so a single router owns all upgrade routing.
   *
   * @param {string} prefix - URL path prefix, e.g. "/ws/editor" or "/socket.io"
   * @param {(req, socket, head) => void} handler - completes the upgrade
   */
  registerUpgradeHandler(prefix, handler) {
    this.upgradeRoutes.push({ prefix, handler })
    // Re-assert this router as the SOLE 'upgrade' listener. socket.io/engine.io
    // installs its own listener when it attaches to the httpServer; dropping all
    // listeners and re-adding ours keeps upgrade routing explicit here whatever
    // the component load order. Idempotent — `_onUpgrade` is a stable bound fn.
    this.httpServer.removeAllListeners("upgrade")
    this.httpServer.on("upgrade", this._onUpgrade)
  }

  _onUpgrade(request, socket, head) {
    // A raw upgrade socket with no 'error' listener crashes the process on a
    // reset, so guard every socket before routing or destroying it.
    socket.on("error", (err) => debug(`upgrade socket error: ${err.message}`))

    let pathname
    try {
      pathname = new URL(request.url, `http://${request.headers.host}`).pathname
    } catch (err) {
      debug(`upgrade: malformed url, destroying socket (${err.message})`)
      socket.destroy()
      return
    }

    const route = this.upgradeRoutes.find((r) => pathname.startsWith(r.prefix))
    if (!route) {
      // No WebSocket endpoint owns this path: close it now (no reaper to rely on).
      socket.destroy()
      return
    }

    try {
      route.handler(request, socket, head)
    } catch (err) {
      debug(`upgrade handler for ${route.prefix} threw: ${err.message}`)
      socket.destroy()
    }
  }
}

module.exports = (app) => new WebServer(app)
