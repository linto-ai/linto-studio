const debug = require("debug")("linto:lib:logger:manager")
const model = require(`${process.cwd()}/lib/mongodb/models`)

const logger = require(`${process.cwd()}/lib/logger/logger`)
const context = require(`${process.cwd()}/lib/logger/context`)
const { calculateWatchTime, reduceToLastActivity } = require(
  `${process.cwd()}/lib/logger/utility`,
)

const SOCKET_EVENTS = require(`${process.cwd()}/lib/dao/log/socketEvent`)
const { isDuplicatePatchEvent } = require(
  `${process.cwd()}/lib/logger/filterCachedLog`,
)

const activityLoggedUrls = ["/api/administration/", "/tokens/"]

class LogManager {
  static async logWebserverEvent(req, message, payload = {}) {
    if ((req.originalUrl || req.url) === "/healthcheck") return

    const ctx = await context.createContext(req, message, payload)
    logger.log(ctx)

    const { method, url } = ctx?.http || {}
    if (!url) return

    if (method === "GET" && !activityLoggedUrls.some((u) => url.includes(u))) {
      return
    }

    const regenerate = url.includes("regenerate=true")

    // Ignore the following routes:
    // - /auth/login
    // - any URL containing conversations/create
    // - /download? with format=summarize-en
    // The routes related to conversations creation and file downloads are already
    // handled by logTranscriptionEvent and logLlmEvent, so we don't process them here.
    // Unless the user regenerate don't regenerate the document

    if (
      url === "/auth/login" ||
      url.includes("conversations/create") ||
      (url.includes("/download?") && regenerate)
    ) {
      return // ignore
    }

    if (isDuplicatePatchEvent(method, url)) {
      return
    }

    model.activityLog.create(ctx)
  }

  static async logSocketEvent(socket, event, payload = {}) {
    const ctx = await context.createSocketContext(socket, event, payload)
    logger.log(ctx)
    delete ctx.message

    if (ctx?.session?.sessionId) {
      let activityLog = (
        await model.activityLog.getBySocketAndSession(
          ctx.socket.id,
          ctx.session.sessionId,
        )
      )[0]

      switch (event.action) {
        case SOCKET_EVENTS.JOIN:
          // Deduplicate: find existing entry for the same person on this session
          if (!activityLog) {
            if (ctx.user?.id) {
              // Logged-in user: lookup by userId + session
              const userLogs = await model.activityLog.getByUserAndSession(
                ctx.user.id,
                ctx.session.sessionId,
              )
              activityLog = userLogs?.[0] || null
            } else if (ctx.socket.visitorId) {
              // Anonymous user: lookup by visitorId + session
              activityLog = (
                await model.activityLog.getLastByVisitorAndSession(
                  ctx.socket.visitorId,
                  ctx.session.sessionId,
                )
              )[0]
            }
          }

          if (!activityLog) {
            ctx.firstConnectionAt = ctx.timestamp
            model.activityLog.create(ctx)
          } else {
            // Accumulate watch time from the previous active period if any
            if (activityLog.socket?.lastJoinedAt) {
              calculateWatchTime(activityLog, ctx)
            }
            model.activityLog.socketReconnect(
              activityLog,
              ctx.timestamp,
              ctx.socket.id,
            )
          }
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
      let activityLogs = await model.activityLog.getBySocketId(ctx.socket.id)
      let activityLog = reduceToLastActivity(activityLogs)

      // For anonymous users, try visitorId on entries still active
      if (!activityLog && ctx.socket.visitorId) {
        activityLog = (
          await model.activityLog.getActiveByVisitorId(ctx.socket.visitorId)
        )[0]
      }

      if (!activityLog) return

      const socketPayload = calculateWatchTime(activityLog, ctx)
      await model.activityLog.socketLeft(
        activityLog,
        socketPayload,
        ctx.timestamp,
      )
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

  static async logChannelEvent(session, channel, action) {
    const ctx = await context.createChannelContext(session, channel, action)
    logger.log(ctx)
    if (ctx) model.activityLog.create(ctx)
  }
}

module.exports = LogManager
