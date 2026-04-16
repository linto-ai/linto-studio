const logger = require(`${process.cwd()}/lib/logger/logger`)
const axios = require(`${process.cwd()}/lib/utility/axios`)

const { storeSession } = require(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
)

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
