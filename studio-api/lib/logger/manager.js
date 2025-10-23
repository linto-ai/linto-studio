const debug = require("debug")("linto:lib:logger:manager")
const model = require(`${process.cwd()}/lib/mongodb/models`)

const logger = require(`${process.cwd()}/lib/logger/logger`)
const context = require(`${process.cwd()}/lib/logger/context`)

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
        await model.activityLog.getBySocketId(
          ctx.socket.id,
          ctx.session.sessionId,
        )
      )[0]

      if (event.action === SOCKET_EVENTS.JOIN) {
        if (!activityLog) model.activityLog.create(ctx)
        else model.activityLog.socketReconnect(activityLog, ctx.timestamp)
      } else if (
        event.action === SOCKET_EVENTS.DISCONNECT ||
        event.action === SOCKET_EVENTS.LEAVE
      ) {
        if (activityLog && activityLog.socket.joinedAt) {
          const joinedAt = new Date(activityLog.socket.joinedAt)
          const durationMs = new Date(ctx.timestamp) - joinedAt
          const durationSeconds = Math.max(0, Math.round(durationMs / 1000))

          const payload = activityLog.socket
          payload.totalWatchTime =
            activityLog.socket.totalWatchTime + durationSeconds
          if (
            payload.totalWatchTime < 300 &&
            event.action === SOCKET_EVENTS.DISCONNECT
          ) {
            await model.activityLog.deleteLog(activityLog._id)
          } else {
            delete payload.joinedAt
            delete payload.leftAt
            await model.activityLog.socketLeft(activityLog, payload)
          }
        }
      }
    } else if (SOCKET_EVENTS.DISCONNECT) {
      await model.activityLog.deleteAllSocketLog(
        ctx.socket.id,
        KEEP_LOG_WITH_WATCHTIME_OVER,
      )
    }
  }

  static async logSystemEvent(message, payload = {}) {
    const ctx = await context.createSystemContext(message, payload)
    if (ctx) logger.log(ctx)
  }
}

module.exports = LogManager
