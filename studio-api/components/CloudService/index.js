const { createPaymentProcessor } = require("linto-saas")
const Component = require(`../component.js`)

/**
 * @description
 * Loads the private linto-saas plugin (entitlements engine, usage ledger,
 * Stripe billing) and mounts its routers. Enabled only when "CloudService" is
 * in process.env.COMPONENTS, so the open-source build is unaffected.
 *
 * The plugin connects mongoose to the SAME Mongo DB as studio (via the shared
 * DB_HOST/DB_PORT/DB_NAME env), storing its data in the saas_* collections.
 */
class CloudService extends Component {
  constructor(app) {
    super(app, "WebServer") // Relies on a WebServer component to be registered

    this.id = this.constructor.name
    this.app = app

    // manageConnection:true (default) -> own mongoose connection to studio's DB.
    // seedOnStart -> upsert the plan catalog on boot.
    this.paymentProcessor = createPaymentProcessor({
      seedOnStart: true,
      stripe: {}, // mode resolved from STRIPE_MODE / STRIPE_SECRET_KEY (fake by default)
    })

    // JSON API + Stripe webhook (raw body) routers.
    this.app.components.WebServer.express.use(
      "/cloud",
      this.paymentProcessor.apiRouter(),
    )
    this.app.components.WebServer.express.use(
      "/cloud/webhook",
      this.paymentProcessor.webhookRouter(),
    )

    return this
  }
}

module.exports = (app) => new CloudService(app)
