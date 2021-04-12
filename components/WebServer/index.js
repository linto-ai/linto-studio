const Component = require(`../component.js`)
const path = require("path")
const debug = require('debug')(`app:webserver`)
const express = require('express')
const fileUpload = require('express-fileupload')
const passport = require('passport')


const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
//const passport = require('passport')
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()
const WebServerErrorHandler = require('./error/handler')

const CORS = require('cors')
let corsOptions = {}

if (process.env.CORS_ENABLED && process.env.CORS_API_WHITELIST.length > 0) {
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
        this.express = app
        this.express = express()
        this.express.set('etag', false)
        this.express.set('trust proxy', true)
        this.express.use(fileUpload())

        this.express.use(bodyParser.json({
            limit: process.env.EXPRESS_SIZE_FILE_MAX,
            extended: true
        }))
        this.express.use(bodyParser.urlencoded({
            limit: '50mb',
            extended: true
        }))
        this.express.use(cookieParser())

        // Public path
        this.express.use('/assets/audios', express.static(`${process.cwd()}/${process.env.VOLUME_AUDIO_LOCATION}`)) // Attaches ./public folder to / route

        // Cross domain whitelist
        if (process.env.CORS_ENABLED) this.express.use(CORS(corsOptions))

        this.express.use(passport.initialize())
        this.express.use(passport.session())

        this.httpServer = this.express.listen(process.env.WEBSERVER_HTTP_PORT, "0.0.0.0", (err) => {
            debug(` WebServer listening on : ${process.env.WEBSERVER_HTTP_PORT}`)
            if (err) throw (err)
        })
        this.httpServer.setTimeout(parseInt(process.env.EXPRESS_TIMEOUT, 10)) //TODO: Set timeout for only required route (upload mainly)

        require('./routes/router.js')(this) // Loads all defined routes
        WebServerErrorHandler.init(this)

        this.express.use('/', express.static(path.resolve(__dirname, './public'))) // Attaches ./public folder to / route
        this.express.use('/swagger-ui/', express.static(pathToSwaggerUi)) // Attaches swagger-ui JS file to /swagger-ui route

        return this.init()
    }
}

module.exports = app => new WebServer(app)