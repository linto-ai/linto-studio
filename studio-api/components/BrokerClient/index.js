const logger = require(`${process.cwd()}/lib/logger/logger`)

const Component = require(`../component.js`)
const MqttClient = require(`${process.cwd()}/lib/mqtt/mqtt.js`)

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
    this.mainState = CONNECTING
    this.notify = true

    this.deliverySubTemplates = [
      (roomId) => `transcriber/out/${roomId}/partial`,
      (roomId) => `transcriber/out/${roomId}/final`,
      (roomId) => `transcriber/out/${roomId}/partial/translations`,
      (roomId) => `transcriber/out/${roomId}/final/translations`,
    ]

    // Non-shared: every replica receives the message. Use for UI fan-out.
    this.mainStaticSubs = [
      `system/out/sessions/statuses`,
      `system/out/sessions/cleared`,
    ]

    this.mainClient = new MqttClient({
      pub: `studio-api`,
      subs: this.mainStaticSubs,
      retain: false,
      uniqueId: "studio-api",
    })
    this.mainClient.on("ready", () => {
      this.notify = true
      this.mainState = READY
      this.mainClient.publishStatus()
    })
    this.mainClient.on("error", (err) => {
      this.mainState = ERROR
      if (this.notify) {
        if (this.app.components["IoHandler"] === undefined) {
          logger.info(
            "BrokerClient requires IoHandler component, not loaded yet",
          )
          return
        }
        this.app.components["IoHandler"].emit("borker_disconnected")
        this.notify = false
      }
    })

    // Shared ($share/): the broker delivers each message to exactly one replica.
    // Use only for side-effects that must run once, never for UI fan-out.
    // Kept on a separate client so the same topic is not received twice.
    this.sharedSubs = [
      `$share/studio-api/system/out/sessions/statuses`,
      `$share/studio-api/system/out/sessions/ended`,
    ]
    this.sharedClient = new MqttClient({
      subs: this.sharedSubs,
      uniqueId: "studio-api-shared",
    })
    this.sharedClient.on("ready", () => {
      this.sharedState = READY
    })
    this.sharedClient.on("error", () => {
      this.sharedState = ERROR
    })

    this.init() // binds controllers, those will handle messages
  }

  subscribe(roomId) {
    for (const sub_template of this.deliverySubTemplates) {
      this.mainClient.subscribe(sub_template(roomId))
    }
  }

  unsubscribe(roomId) {
    for (const sub_template of this.deliverySubTemplates) {
      this.mainClient.unsubscribe(sub_template(roomId))
    }
  }
}

module.exports = (app) => new BrokerClient(app)
