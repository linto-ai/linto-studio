const debug = require("debug")("linto:lib:logger:manager")
// const { logger, context } = require(`${process.cwd()}/lib/logger`)
const logger = require(`${process.cwd()}/lib/logger/logger`)
const context = require(`${process.cwd()}/lib/logger/context`)

class LogManager {
  static async logWebserverEvent(req, message, payload = {}) {
    const ctx = await context.createContext(req, message, payload)
    logger.log(ctx)
  }

  static async logSocketEvent(socket, event, payload = {}) {
    const ctx = await context.createSocketContext(socket, event, payload)
    logger.log(ctx)
  }

  static async logSystemEvent(message, payload = {}) {
    const ctx = await context.createSystemContext(message, payload)
    logger.log(ctx)
  }
}

module.exports = LogManager
