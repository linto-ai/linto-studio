const debug = require("debug")("delivery:BrokerClient:mqtt-events-delivery")

module.exports = function () {
  this.deliveryClient.on("message", (topic, message) => {
    const [type, out, session_id, channel_index, action] = topic.split("/")
    this.app.components["IoHandler"].emit(
      action,
      session_id + "/" + channel_index,
      JSON.parse(message.toString()),
    )
  })

  this.on("join_room", (roomId) => {
    this.subscribe(roomId)
  })

  this.on("leave_room", (roomId) => {
    this.unsubscribe(roomId)
  })
}
