const debug = require("debug")(
  "linto:components:IoHandler:controllers:MqttEvents",
)

const retryInterval = 10000 // Retry every 10 seconds
const maxRetries = 5 // Maximum number of retries

// The BrokerClient need to know if the IoHandler is connected to the broker
const retryConnectionOperation = (operation, app, retryCount = 0) => {
  if (app.components["IoHandler"]) {
    operation()
  } else if (retryCount < maxRetries) {
    setTimeout(
      () => retryConnectionOperation(operation, app, retryCount + 1),
      retryInterval,
    )
  } else {
    debug("IoHandler not loaded after maximum retries")
  }
}

module.exports = function () {
  if (!this.app.components["BrokerClient"]) {
    return
  }
  const mainClient = this.app.components["BrokerClient"].mainClient

  mainClient.on("error", () => {
    retryConnectionOperation(
      () => this.app.components["IoHandler"].brokerKo(),
      this.app,
    )
  })

  mainClient.on("offline", () => {
    retryConnectionOperation(
      () => this.app.components["IoHandler"].brokerKo(),
      this.app,
    )
  })

  mainClient.on("ready", () => {
    retryConnectionOperation(
      () =>
        this.app.components["IoHandler"].brokerOk(
          "Broker connection established",
        ),
      this.app,
    )
  })
}
