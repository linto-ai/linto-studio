const mongoDb = require("mongodb")
const { MongoClient } = require("mongodb")
const logger = require(`${process.cwd()}/lib/logger/logger`)

const index = require("./index/init.js")
const user = require("./populate/init.js")

let urlMongo = "mongodb://"

//user access
if (process.env.DB_REQUIRE_LOGIN === "true")
  urlMongo += process.env.DB_USER + ":" + process.env.DB_PASS + "@"

urlMongo += process.env.DB_HOST + ":" + process.env.DB_PORT + "/"

if (process.env.DB_REQUIRE_LOGIN === "true")
  urlMongo += "?authSource=" + process.env.DB_NAME

class MongoDriver {
  static db
  static mongoDb = mongoDb
  static urlMongo = urlMongo
  static client = new MongoClient(MongoDriver.urlMongo, {
    connectTimeoutMS: 5000,
    maxPoolSize: 40,
  })
  static readyPromise = null

  static checkConnection() {
    try {
      if (!!MongoDriver.db && MongoDriver.db.serverConfig) {
        return MongoDriver.db.serverConfig.isConnected()
      } else {
        return false
      }
    } catch (error) {
      logger.error(error)
      return false
    }
  }

  static async connect() {
    if (MongoDriver.db) return
    try {
      await MongoDriver.client.connect()
      logger.info("> MongoDB : Connected")
      MongoDriver.db = MongoDriver.client.db(process.env.DB_NAME)
      logger.info(
        `> MongoDB : Successfully connected to database "${process.env.DB_NAME}"`,
      )

      MongoDriver.client.on("close", () => {
        logger.error("> MongoDb : Connection lost")
      })
      MongoDriver.client.on("error", (e) => {
        logger.error("> MongoDb ERROR: ", e)
      })
      MongoDriver.client.on("reconnect", () => {
        logger.info("> MongoDb : Reconnected")
      })

      index.createIndex(MongoDriver)
      user.createSuperAdmin()
    } catch (err) {
      logger.error("> MongoDB ERROR unable to connect:", err)
      throw err
    }
  }

  static ready() {
    if (!MongoDriver.readyPromise) {
      MongoDriver.readyPromise = MongoDriver.connect()
    }
    return MongoDriver.readyPromise
  }

  constructor() {
    if (!MongoDriver.checkConnection()) {
      MongoDriver.ready()
    }
  }
}

module.exports = new MongoDriver()
