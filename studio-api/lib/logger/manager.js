const debug = require("debug")("linto:lib:logger:manager")
const model = require(`${process.cwd()}/lib/mongodb/models`)

const logger = require(`${process.cwd()}/lib/logger/logger`)
const context = require(`${process.cwd()}/lib/logger/context`)
const { calculateWatchTime, reduceToLastActivity } = require(
  `${process.cwd()}/lib/logger/utility`,
)

const SOCKET_EVENTS = require(`${process.cwd()}/lib/dao/log/socketEvent`)

const activityLoggedUrls = ["/api/administration/", "/tokens/"]

class LogManager {
  static async logWebserverEvent(req, message, payload = {}) {
    const ctx = await context.createContext(req, message, payload)
    logger.log(ctx)

    const { method, url } = ctx?.http || {}
    if (method === "GET" && !activityLoggedUrls.some((u) => url?.includes(u))) {
      return
    }

    const match = url.match(/format=([^&]+)/)
    const format = match ? match[1] : null
    // Ignore the following routes:
    // - /auth/login
    // - any URL containing conversations/create
    // - /download? with format=summarize-en
    // The routes related to conversations creation and file downloads are already
    // handled by logTranscriptionEvent and logLlmEvent, so we don't process them here.
    // extract format if present
    if (
      url === "/auth/login" ||
      url.includes("conversations/create") ||
      (url.includes("/download?") && format && format !== "verbatim")
    ) {
      return // ignore
    }
    model.activityLog.create(ctx)
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
          if (!activityLog) {
            ctx.firstConnectionAt = ctx.timestamp
            model.activityLog.create(ctx)
          } else model.activityLog.socketReconnect(activityLog, ctx.timestamp)
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
      await model.activityLog.socketLeft(
        activityLog,
        socketPayload,
        ctx.timestamp,
      )
      // }
    }
  }
  static async logLlmEvent(req, payload) {
    const ctx = await context.createLlmContext(req, payload)
    if (ctx) model.activityLog.create(ctx)
  }

  static async logTranscriptionEvent(req, payload) {
    const ctx = await context.createTranscriptionContext(req, payload)
    if (ctx) model.activityLog.create(ctx)
  }

  static async logSystemEvent(message, payload = {}) {
    const ctx = await context.createSystemContext(message, payload)
    if (ctx) logger.log(ctx)
  }
}

module.exports = LogManager
