const debug = require(`debug`)(`linto:components:BrokerClient:index`)
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

    this.mainStaticSubs = [`system/out/sessions/statuses`]

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

    // Separate client: a single MQTT client subscribing to both a shared
    // and a non-shared filter on the same topic would receive each message
    // twice. Round-robin distribution across replicas is what dedupes
    // activity log writes.
    this.activityLogSubs = [`$share/studio-api/system/out/sessions/statuses`]
    this.activityLogClient = new MqttClient({
      subs: this.activityLogSubs,
      uniqueId: "studio-api-activity-log",
    })
    this.activityLogClient.on("ready", () => {
      this.activityLogState = READY
    })
    this.activityLogClient.on("error", (err) => {
      this.activityLogState = ERROR
    })

    this.init() // binds controllers, those will handle messages
  }

  subscribe(roomId) {
    debug(`Subscribe to transcriber ${roomId}`)
    for (const sub_template of this.deliverySubTemplates) {
      this.mainClient.subscribe(sub_template(roomId))
    }
  }

  unsubscribe(roomId) {
    debug(`Unsubscribe from transcriber ${roomId}`)
    for (const sub_template of this.deliverySubTemplates) {
      this.mainClient.unsubscribe(sub_template(roomId))
    }
  }
}

module.exports = (app) => new BrokerClient(app)
