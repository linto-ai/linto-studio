const Component = require(`../component.js`)
const path = require("path")
const debug = require('debug')(`linto:components:webserver`)
const express = require('express')
const fileUpload = require('express-fileupload')
const passport = require('passport')
const bodyParser = require('body-parser')
const WebServerErrorHandler = require('./error/handler')

const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require("swagger-jsdoc")

let swaggerDocument = require('./apidoc/swagger.json')

const CORS = require('cors')
let corsOptions = {}
if (process.env.CORS_ENABLED === 'true' && process.env.CORS_API_WHITELIST.length > 0) {
    whitelistDomains = process.env.CORS_API_WHITELIST.split(',')
    corsOptions = {
        origin: function (origin, callback) {
            if (!origin || whitelistDomains.indexOf(origin) !== -1 || origin === 'undefined') {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    }
}

class WebServer extends Component {
    constructor(app) {
        super(app)
        this.id = this.constructor.name
        this.app = app

        this.express = express()
        this.express.set('etag', false)
        this.express.set('trust proxy', true)
        this.express.use(fileUpload({
            uriDecodeFileNames: true
        }))

        this.express.use(bodyParser.json({
            limit: process.env.EXPRESS_SIZE_FILE_MAX,
            extended: true
        }))
        this.express.use(bodyParser.urlencoded({
            limit: process.env.EXPRESS_SIZE_FILE_MAX,
            extended: true
        }))

        // Cross domain whitelist
        if (process.env.CORS_ENABLED === 'true') this.express.use(CORS(corsOptions))

        this.express.use(passport.initialize())
        this.express.use(passport.session())

        this.express.use('/media/pictures', express.static(`${process.env.VOLUME_FOLDER}/${process.env.VOLUME_PROFILE_PICTURE_PATH}`))

        this.httpServer = this.express.listen(process.env.WEBSERVER_HTTP_PORT, "0.0.0.0", (err) => {
            debug(` WebServer listening on : ${process.env.WEBSERVER_HTTP_PORT}`)
            if (err) throw (err)
        })

        require('./routes/router.js')(this) // Loads all defined routes
        WebServerErrorHandler.init(this) // Manage error from controllers

        if(!process.env.WEBSERVER_HTTP_HOST)
            process.env.WEBSERVER_HTTP_HOST = "localhost"
        swaggerDocument.definition.host = process.env.WEBSERVER_HTTP_HOST + ":" + process.env.WEBSERVER_HTTP_PORT
        swaggerDocument.definition.paths = require('./apidoc/index.js')
        swaggerDocument.definition.components = {
            ...swaggerDocument.definition.components,
            ...require('./apidoc/components/index.js')
        }

        swaggerDocument.apis = ["./apidoc/"]

        this.express.use(
            "/apidoc",
            swaggerUi.serve,
            swaggerUi.setup(swaggerJsdoc(swaggerDocument))
        );

        return this.init()
    }
}

module.exports = app => new WebServer(app)