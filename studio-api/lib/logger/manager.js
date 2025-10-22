const debug = require("debug")("linto:lib:logger:manager")
const model = require(`${process.cwd()}/lib/mongodb/models`)

const logger = require(`${process.cwd()}/lib/logger/logger`)
const context = require(`${process.cwd()}/lib/logger/context`)

class LogManager {
  static async logWebserverEvent(req, message, payload = {}) {
    const ctx = await context.createContext(req, message, payload)
    logger.log(ctx)

    if (ctx?.http?.method !== "GET") {
      model.activityLog.create(ctx)
    }
  }

  static async logSocketEvent(socket, event, payload = {}) {
    const ctx = await context.createSocketContext(socket, event, payload)
    logger.log(ctx)
  }

  static async logSystemEvent(message, payload = {}) {
    const ctx = await context.createSystemContext(message, payload)
    if (ctx) logger.log(ctx)
  }
}

module.exports = LogManager
