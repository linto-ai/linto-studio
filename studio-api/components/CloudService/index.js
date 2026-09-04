const Component = require(`../component.js`)

// The private SaaS plugin is not a declared dependency: it is installed into the
// image at deploy time. This module is only required when "CloudService" is in
// COMPONENTS, so a missing package is an operator error, reported as such.
let createPaymentProcessor
try {
  ;({ createPaymentProcessor } = require("linto-saas"))
} catch (err) {
  throw new Error(
    "CloudService is enabled but the private 'linto-saas' plugin is not installed. " +
      "Install it in studio-api (npm install <path-to-linto-saas>) or drop " +
      "CloudService from COMPONENTS to run the open-source build. " +
      `Original error: ${err.message}`,
  )
}

const auth_middlewares = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
const organization_access = require(
  `${process.cwd()}/components/WebServer/middlewares/access/organization`,
)
const platform_access = require(
  `${process.cwd()}/components/WebServer/middlewares/access/platform`,
)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const LogManager = require(`${process.cwd()}/lib/logger/manager`)
const logger = require(`${process.cwd()}/lib/logger/logger`)

const ROLE_MAP = {
  member: ROLES.MEMBER,
  uploader: ROLES.UPLOADER,
  maintainer: ROLES.MAINTAINER,
  admin: ROLES.ADMIN,
}

// Studio's identity model, injected into the plugin's /cloud router. The plugin
// sets req.saasOrgId per route; these decide.
function buildGuards() {
  return {
    authenticate: auth_middlewares.isAuthenticate,

    // Caller holds >= roleName in req.saasOrgId, or is a platform sys-admin.
    authorizeOrg: (roleName) => async (req, res, next) => {
      try {
        const right = ROLE_MAP[roleName]
        if (!right)
          throw new Error(
            `CloudService: unknown role "${roleName}" in authorizeOrg`,
          )
        if (await platform_access.isSystemAdministrator(req)) {
          req.userRole = ROLES.ADMIN
          return next()
        }
        await organization_access.access(
          req,
          next,
          req.saasOrgId,
          req.payload.data.userId,
          right,
        )
      } catch (err) {
        next(err)
      }
    },

    // Backoffice routes: platform sys-admin, which studio only grants with
    // ?userScope=backoffice (the front adds it on /backoffice pages).
    authorizePlatformAdmin: platform_access.isPlatformSystemAdministrator,

    // Billable seats = members with role >= uploader, floored at 1. null on
    // failure so the plugin falls back to the request instead of mis-billing.
    resolveSeats: async (orgId) => {
      try {
        const orgs = await model.organizations.getById(orgId)
        if (!orgs || orgs.length !== 1) return null
        const seats = (orgs[0].users || []).filter(
          (u) => u.role >= ROLES.UPLOADER,
        ).length
        return Math.max(1, seats)
      } catch (e) {
        return null
      }
    },
  }
}

// The plugin's view of a caller, read by the engine on gated requests and,
// cached, by the API-call meter. Null when the user does not exist.
async function resolveRequester(userId) {
  const rows = await model.users.getByIdFilter(userId, {
    type: 1,
    emailIsVerified: 1,
  })
  const user = Array.isArray(rows) ? rows[0] : null
  if (!user) return null
  return {
    type: user.type === USER_TYPE.M2M ? "machine" : "user",
    emailVerified: user.emailIsVerified === true,
  }
}

/**
 * Loads the private linto-saas plugin and mounts its routers. Enabled only when
 * "CloudService" is in COMPONENTS, so the open-source build never loads it.
 *
 * The plugin opens its own mongoose connection to studio's Mongo (same env)
 * and keeps its data in saas_* collections. /cloud runs behind studio's guards;
 * /cloud/webhook is raw-body, Stripe-signed, outside JWT auth.
 */
class CloudService extends Component {
  constructor(app) {
    super(app, "WebServer")

    this.id = this.constructor.name
    this.app = app

    // SAAS_DEFAULT_PLAN_KEY is the plan an org WITHOUT a subscription row falls
    // back to. Point it at a permissive plan on the first activation while the
    // existing orgs are classified, then set it back (SPEC-SAAS.md §6).
    this.paymentProcessor = createPaymentProcessor({
      seedOnStart: true,
      defaultPlanKey: process.env.SAAS_DEFAULT_PLAN_KEY || undefined,
      stripe: {},
      resolveRequester,
    })

    // Init runs in the background. A failure leaves the plugin loaded and every
    // gate fail-closed (402/403 everywhere); make it impossible to miss.
    this.paymentProcessor.on("error", (err) => {
      logger.error(
        `[saas] plugin init failed, every SaaS gate now denies: ${err && err.message}`,
      )
    })

    // Billing events -> studio's activity log (backoffice "Facturation" tab).
    this.paymentProcessor.on("saas-event", (event) => {
      LogManager.logSaasEvent(event)
    })

    // Machine-token API calls are counted by the plugin; studio only offers the
    // slot after authentication (lib/saas.afterAuth).
    this.paymentProcessor.hostAfterAuth = this.paymentProcessor.apiCallMeter()

    this.app.components.WebServer.express.use(
      "/cloud",
      this.paymentProcessor.apiRouter(buildGuards()),
    )
    this.app.components.WebServer.express.use(
      "/cloud/webhook",
      this.paymentProcessor.webhookRouter(),
    )

    return this
  }
}

module.exports = (app) => new CloudService(app)
