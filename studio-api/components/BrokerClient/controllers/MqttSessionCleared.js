const logger = require(`${process.cwd()}/lib/logger/logger`)

module.exports = function () {
  // Non-shared client: every replica must clear the transcript for its own
  // sockets, otherwise only clients on the one replica notified would update.
  this.mainClient.on("message", (topic, message) => {
    if (topic !== "system/out/sessions/cleared") return

    if (this.app.components["IoHandler"] === undefined) {
      logger.info("BrokerClient requires IoHandler component, not loaded yet")
      return
    }

    let notification
    try {
      notification = JSON.parse(message.toString())
    } catch (err) {
      logger.error(
        `sessionCleared: failed to parse message on ${topic}: ${err}`,
      )
      return
    }

    const { id: sessionId, organizationId } = notification || {}
    if (!sessionId || !organizationId) return

    this.app.components["IoHandler"].emit(
      "session_cleared",
      organizationId,
      sessionId,
    )
  })
}
