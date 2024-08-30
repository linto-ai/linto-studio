const debug = require("debug")(`linto:components:BrokerClient`)
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
      (transcriberId) => `transcriber/out/${transcriberId}/partial`,
      (transcriberId) => `transcriber/out/${transcriberId}/final`,
    ]
    this.deliverySubs = [`transcriber/out/+/partial`, `transcriber/out/+/final`]

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

  subscribe(transcriberId) {
    debug(`Subscribe to transcriber ${transcriberId}`)
    for (const sub_template of this.deliverySubTemplates) {
      this.deliveryClient.subscribe(sub_template(transcriberId))
    }
  }

  unsubscribe(transcriberId) {
    debug(`Unsubscribe from transcriber ${transcriberId}`)
    for (const sub_template of this.deliverySubTemplates) {
      this.deliveryClient.unsubscribe(sub_template(transcriberId))
    }
  }
}

module.exports = (app) => new BrokerClient(app)
