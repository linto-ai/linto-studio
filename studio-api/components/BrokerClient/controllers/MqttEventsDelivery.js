const debug = require("debug")(
  "linto:components:BrokerClient:controllers:MqttEventsDelivery",
)
const logger = require(`${process.cwd()}/lib/logger/logger`)

module.exports = function () {
  this.deliveryClient.on("message", (topic, message) => {
    const parts = topic.split("/")
    let session_id, channel_index, action

    if (parts.length === 6) {
      // transcriber/out/{sessionId}/{channelId}/final/translations
      session_id = parts[2]
      channel_index = parts[3]
      action = "translation"
    } else if (parts.length === 5) {
      // transcriber/out/{sessionId}/{channelId}/partial|final
      session_id = parts[2]
      channel_index = parts[3]
      action = parts[4]
    } else {
      logger.error(`Unexpected topic format: "${topic}"`)
      return
    }

    try {
      let parsedMessage = JSON.parse(message.toString())
      this.app.components["IoHandler"].emit(
        action,
        session_id + "/" + channel_index,
        parsedMessage,
      )
    } catch (error) {
      this.app.components["IoHandler"].emit(
        "error",
        session_id + "/" + channel_index,
        { error: "Error parsing message" },
      )
    }
  })

  this.organizationClient.on("message", (topic, message) => {
    let parsedMessage = JSON.parse(message.toString())

    if (this.app.components["IoHandler"] === undefined) {
      logger.info("BrokerClient requires IoHandler component, not loaded yet")
      return
    }
    this.app.components["IoHandler"].emit(
      "watch_organization",
      topic,
      parsedMessage,
    )
  })

  this.on("join_room", (roomId) => {
    this.subscribe(roomId)
  })

  this.on("leave_room", (roomId) => {
    this.unsubscribe(roomId)
  })
}
