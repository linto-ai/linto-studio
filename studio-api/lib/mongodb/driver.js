const mongoDb = require('mongodb')
const index = require('./index/init.js')

let urlMongo = 'mongodb://'

//user access
if (process.env.DB_REQUIRE_LOGIN === "true")
    urlMongo += process.env.DB_USER + ':' + process.env.DB_PASS + '@'

urlMongo += process.env.DB_HOST + ':' + process.env.DB_PORT + '/'

if (process.env.DB_REQUIRE_LOGIN === "true")
    urlMongo += '?authSource=' + process.env.DB_NAME

// Create an instance of a MongoDb client. Handle connection/close connection/reconnect/error
class MongoDriver {
    static mongoDb = mongoDb
    static urlMongo = urlMongo
    static client = mongoDb.MongoClient
    static db = null

    // Check mongo db connection status
    static checkConnection() {
        try {
            if (!!MongoDriver.db && MongoDriver.db.serverConfig) {
                return MongoDriver.db.serverConfig.isConnected()
            } else {
                return false
            }
        } catch (error) {
            console.error(error)
            return false
        }
    }

    constructor() {
        this.poolOptions = {
                numberOfRetries: 5,
                auto_reconnect: true,
                poolSize: 40,
                connectTimeoutMS: 5000,
                userNewUrlParser: true,
                useUnifiedTopology: true // ?? this is now false??
            }
            //if connection exists
        if (MongoDriver.checkConnection()) {
            return this
        }

        //??what happens if there is no connection
        MongoDriver.client.connect(MongoDriver.urlMongo, MongoDriver.poolOptions, (err, client) => {
            if (err) {
                console.error('> MongoDB ERROR unable to connect:', err.toString())
            } else {
                console.log('> MongoDB : Connected')
                MongoDriver.db = client.db(process.env.DB_NAME)
                const mongoEvent = client.topology //??what is this??

                index.createIndex(MongoDriver)

                mongoEvent.on('close', () => {
                    console.error('> MongoDb : Connection lost')
                })
                mongoEvent.on('error', (e) => {
                    console.error('> MongoDb ERROR: ', e)
                })
                mongoEvent.on('reconnect', () => {
                        console.error('> MongoDb : reconnect')
                    })
                    /* ALL EVENTS */
                    /*
                    commandStarted: [Function (anonymous)],
                    commandSucceeded: [Function (anonymous)],
                    commandFailed: [Function (anonymous)],
                    serverOpening: [Function (anonymous)],
                    serverClosed: [Function (anonymous)],
                    serverDescriptionChanged: [Function (anonymous)],
                    serverHeartbeatStarted: [Function (anonymous)],
                    serverHeartbeatSucceeded: [Function (anonymous)],
                    serverHeartbeatFailed: [Function (anonymous)],
                    topologyOpening: [Function (anonymous)],
                    topologyClosed: [Function (anonymous)],
                    topologyDescriptionChanged: [Function (anonymous)],
                    joined: [Function (anonymous)],
                    left: [Function (anonymous)],
                    ping: [Function (anonymous)],
                    ha: [Function (anonymous)],
                    connectionPoolCreated: [Function (anonymous)],
                    connectionPoolClosed: [Function (anonymous)],
                    connectionCreated: [Function (anonymous)],
                    connectionReady: [Function (anonymous)],
                    connectionClosed: [Function (anonymous)],
                    connectionCheckOutStarted: [Function (anonymous)],
                    connectionCheckOutFailed: [Function (anonymous)],
                    connectionCheckedOut: [Function (anonymous)],
                    connectionCheckedIn: [Function (anonymous)],
                    connectionPoolCleared: [Function (anonymous)],
                    authenticated: [Function (anonymous)],
                    error: [ [Function (anonymous)], [Function: listener] ],
                    timeout: [ [Function (anonymous)], [Function: listener] ],
                    close: [ [Function (anonymous)], [Function: listener] ],
                    parseError: [ [Function (anonymous)], [Function: listener] ],
                    open: [ [Function], [Function] ],
                    fullsetup: [ [Function], [Function] ],
                    all: [ [Function], [Function] ],
                    reconnect: [ [Function (anonymous)], [Function: listener] ]
                    */
            }
        })

    }

}

module.exports = new MongoDriver()