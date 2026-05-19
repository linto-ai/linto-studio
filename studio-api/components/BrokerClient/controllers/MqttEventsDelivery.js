const debug = require("debug")(
  "linto:components:BrokerClient:controllers:MqttEventsDelivery",
)
const logger = require(`${process.cwd()}/lib/logger/logger`)

module.exports = function () {
  this.mainClient.on("message", (topic, message) => {
    if (topic === "system/out/sessions/statuses") {
      handleOrganizationMessage.call(this, topic, message)
      return
    }
    if (topic.startsWith("transcriber/out/")) {
      handleTranscriberMessage.call(this, topic, message)
      return
    }
    debug(`Ignored message on unexpected topic: "${topic}"`)
  })

  this.on("join_room", (roomId) => {
    this.subscribe(roomId)
  })

  this.on("leave_room", (roomId) => {
    this.unsubscribe(roomId)
  })
}

function handleTranscriberMessage(topic, message) {
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
    const parsedMessage = JSON.parse(message.toString())
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
}

function handleOrganizationMessage(topic, message) {
  if (this.app.components["IoHandler"] === undefined) {
    logger.info("BrokerClient requires IoHandler component, not loaded yet")
    return
  }
  try {
    const parsedMessage = JSON.parse(message.toString())
    this.app.components["IoHandler"].emit(
      "watch_organization",
      topic,
      parsedMessage,
    )
  } catch (err) {
    logger.error(`watch_organization: failed to parse message: ${err}`)
  }
}
