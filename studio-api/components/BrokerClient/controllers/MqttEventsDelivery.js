const debug = require("debug")("delivery:BrokerClient:mqtt-events-delivery")

module.exports = function () {
  this.deliveryClient.on("message", (topic, message) => {
    const [type, out, transcriberId, action] = topic.split("/")
    this.app.components["IoHandler"].emit(
      action,
      transcriberId,
      JSON.parse(message.toString()),
    )
  })

  this.on("join_room", (transcriberId) => {
    this.subscribe(transcriberId)
  })

  this.on("leave_room", (transcriberId) => {
    this.unsubscribe(transcriberId)
  })
}
