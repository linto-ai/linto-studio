const logger = require(`${process.cwd()}/lib/logger/logger`)
const axios = require(`${process.cwd()}/lib/utility/axios`)

const { storeSession } = require(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
)
const saas = require(`${process.cwd()}/lib/saas`)

module.exports = function () {
  this.sharedClient.on("message", async (topic, message) => {
    if (topic !== "system/out/sessions/ended") return

    let notification
    try {
      notification = JSON.parse(message.toString())
    } catch (err) {
      logger.error(`sessionEnded: failed to parse message on ${topic}: ${err}`)
      return
    }

    const sessionId = notification?.id
    if (!sessionId) return

    let session
    try {
      session = await axios.get(
        process.env.SESSION_API_ENDPOINT + `/sessions/${sessionId}`,
      )
    } catch (err) {
      const status = err?.response?.status || err?.status
      if (status !== 404) {
        logger.error(
          `sessionEnded failed to fetch session ${sessionId}: ${err?.message || err}`,
        )
      }
      return
    }

    let stored
    try {
      stored = await storeSession(session)
    } catch (err) {
      logger.error(
        `sessionEnded storeSession FAILED id=${sessionId}: ${err?.stack || err}`,
      )
      return
    }

    if (!stored) return

    // SaaS metering: record the finished live session's billable duration,
    // idempotent by sessionId. FAIL-SOFT, never blocks. No-op if plugin absent.
    // `session` is the Session-API body (organizationId, startTime, endTime).
    await saas.recordLive({
      orgId: session.organizationId,
      sessionId: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
    })

    try {
      await axios.delete(
        process.env.SESSION_API_ENDPOINT + `/sessions/${sessionId}`,
      )
    } catch (err) {
      const status = err?.response?.status || err?.status
      if (status !== 404) {
        logger.error(
          `sessionEnded failed to delete session ${sessionId}: ${err?.message || err}`,
        )
      }
    }
  })
}
