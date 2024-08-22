const debug = require("debug")(`delivery:BrokerClient`)
const { MqttClient, Component } = require("live-srt-lib")

class BrokerClient extends Component {
  static states = {
    CONNECTING: "connecting",
    READY: "ready",
    ERROR: "error",
  }

  _state = null

  constructor(app) {
    super(app)
    const { CONNECTING, READY, ERROR } = this.constructor.states
    this.id = this.constructor.name
    this.deliveryState = CONNECTING
    this.sessionState = CONNECTING

    // Combined pub and subs
    this.deliveryPub = "delivery"
    this.deliverySubTemplates = [
      // roomId is the concatenation of session_id / channel_index
      (roomId) => `transcriber/out/${roomId}/partial`,
      (roomId) => `transcriber/out/${roomId}/final`,
    ]
    this.deliverySubs = [
      `transcriber/out/+/+/partial`,
      `transcriber/out/+/+/final`,
    ]

    // Initialize delivery client
    this.deliveryClient = new MqttClient({
      pub: this.deliveryPub,
      subs: this.deliverySubs,
      retain: false,
      uniqueId: "delivery",
    })
    this.deliveryClient.on("ready", () => {
      this.deliveryState = READY
    })
    this.deliveryClient.on("error", (err) => {
      this.deliveryState = ERROR
    })

    this.sessionPub = `session/out`
    this.sessionSubs = [`session/in/+/#`]
    // Initialize session client
    this.sessionClient = new MqttClient({
      pub: this.sessionPub,
      subs: this.sessionSubs,
      retain: false,
      uniqueId: "session-api",
    })
    this.sessionClient.on("ready", () => {
      this.sessionState = READY
      this.sessionClient.publishStatus()
    })
    this.sessionClient.on("error", (err) => {
      this.sessionState = ERROR
    })
    this.init() // binds controllers, those will handle messages
  }

  subscribe(roomId) {
    debug(`Subscribe to transcriber ${roomId}`)
    for (const sub_template of this.deliverySubTemplates) {
      this.deliveryClient.subscribe(sub_template(roomId))
    }
  }

  unsubscribe(roomId) {
    debug(`Unsubscribe from transcriber ${roomId}`)
    for (const sub_template of this.deliverySubTemplates) {
      this.deliveryClient.unsubscribe(sub_template(roomId))
    }
  }
}

module.exports = (app) => new BrokerClient(app)
