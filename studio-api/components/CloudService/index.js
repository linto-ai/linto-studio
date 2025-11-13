const { createPaymentProcessor } = require(`../../../../linto-payment-processor/linto-saas/index.js`)
const Component = require(`../component.js`)

/**
 * @description
 * This component is used to handle the cloud service functions.
 */
class CloudService extends Component {
  constructor(app) {
    super(app, "WebServer") // Relies on a WebServer component to be registrated

    this.id = this.constructor.name
    this.app = app
    this.paymentProcessor = createPaymentProcessor()
    this.app.components.WebServer.express.use("/cloud", this.paymentProcessor.apiRouter())
    this.app.components.WebServer.express.use("/cloud/webhook", this.paymentProcessor.webhookRouter())

    return this
  }
}

module.exports = (app) => new CloudService(app)
