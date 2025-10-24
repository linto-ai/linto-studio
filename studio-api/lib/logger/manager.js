const debug = require("debug")("linto:lib:logger:manager")
const model = require(`${process.cwd()}/lib/mongodb/models`)

const logger = require(`${process.cwd()}/lib/logger/logger`)
const context = require(`${process.cwd()}/lib/logger/context`)
const { calculateWatchTime, reduceToLastActivity } = require(
  `${process.cwd()}/lib/logger/utility`,
)

const SOCKET_EVENTS = require(`${process.cwd()}/lib/dao/log/socketEvent`)

const KEEP_LOG_WITH_WATCHTIME_OVER = 300
const activityLoggedUrls = ["/api/administration/", "/tokens/"]

class LogManager {
  static async logWebserverEvent(req, message, payload = {}) {
    const ctx = await context.createContext(req, message, payload)
    logger.log(ctx)

    if (
      ctx?.http?.method !== "GET" ||
      activityLoggedUrls.some((u) => ctx?.http?.url?.includes(u))
    ) {
      model.activityLog.create(ctx)
    }
  }

  static async logSocketEvent(socket, event, payload = {}) {
    const ctx = await context.createSocketContext(socket, event, payload)
    logger.log(ctx)
    delete ctx.message

    if (ctx?.session?.sessionId) {
      const activityLog = (
        await model.activityLog.getBySocketAndSession(
          ctx.socket.id,
          ctx.session.sessionId,
        )
      )[0]

      switch (event.action) {
        case SOCKET_EVENTS.JOIN:
          if (!activityLog) model.activityLog.create(ctx)
          else model.activityLog.socketReconnect(activityLog, ctx.timestamp)
          break
        case SOCKET_EVENTS.LEAVE:
        case SOCKET_EVENTS.DISCONNECT:
          if (activityLog) {
            const socketPayload = calculateWatchTime(activityLog, ctx)
            await model.activityLog.socketLeft(
              activityLog,
              socketPayload,
              ctx.timestamp,
            )
          }
          break
      }

      // On browser closed we don't have a sessionId
    } else if (event.action === SOCKET_EVENTS.DISCONNECT) {
      const activityLogs = await model.activityLog.getBySocketId(ctx.socket.id)
      const activityLog = reduceToLastActivity(activityLogs)
      if (!activityLog) return

      const socketPayload = calculateWatchTime(activityLog, ctx)
      if (socketPayload.totalWatchTime < KEEP_LOG_WITH_WATCHTIME_OVER) {
        await model.activityLog.deleteAllSocketLog(
          ctx.socket.id,
          KEEP_LOG_WITH_WATCHTIME_OVER,
        )
      } else {
        await model.activityLog.socketLeft(
          activityLog,
          socketPayload,
          ctx.timestamp,
        )
      }
    }
  }

  static async logSystemEvent(message, payload = {}) {
    const ctx = await context.createSystemContext(message, payload)
    if (ctx) logger.log(ctx)
  }
}

module.exports = LogManager
