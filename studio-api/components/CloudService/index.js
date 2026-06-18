const { createPaymentProcessor } = require("linto-saas")
const Component = require(`../component.js`)

// Studio auth model, reused to secure the /cloud API (see buildGuards).
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
const model = require(`${process.cwd()}/lib/mongodb/models`)

const ROLE_MAP = {
  member: ROLES.MEMBER,
  uploader: ROLES.UPLOADER,
  maintainer: ROLES.MAINTAINER,
  admin: ROLES.ADMIN,
}

// Authorization guards injected into the plugin's /cloud router. The plugin sets
// req.saasOrgId per route; these decide access using studio's identity model.
// Without these, /cloud would be wide open (IDOR + unauthenticated billing ops).
function buildGuards() {
  return {
    // express-jwt + payload population (array of middlewares). Denies invalid /
    // missing tokens with 401 (surfaced by the plugin error handler via .status).
    authenticate: auth_middlewares.isAuthenticate,

    // Caller must hold >= roleName in req.saasOrgId. Mirrors asAdminAccess: a
    // backoffice platform sys-admin bypasses, otherwise the org membership/role
    // check decides. access() calls next(err) on denial -> proper 403.
    authorizeOrg: (roleName) => async (req, res, next) => {
      try {
        if (await platform_access.isSystemAdministrator(req)) {
          req.userRole = ROLES.ADMIN
          return next()
        }
        const right = ROLE_MAP[roleName] || ROLES.ADMIN
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

    // Backoffice operations (comp/exempt, forced seat sync) -> platform sys-admin.
    // NOTE: studio's isPlatformSystemAdministrator only grants when the request
    // carries ?userScope=backoffice (see middlewares/access/platform.js). This is
    // the studio convention for backoffice actions — the frontend's sendRequest
    // adds userScope=backoffice automatically on /backoffice pages. Any caller of
    // /cloud/admin/* MUST therefore run in backoffice scope, exactly like studio's
    // own backoffice routes.
    authorizePlatformAdmin: platform_access.isPlatformSystemAdministrator,

    // Billable seats are derived from org membership (members with role >=
    // uploader, floored at 1). Returns null on any failure so the plugin falls
    // back to the request-supplied seats rather than mis-billing.
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

/**
 * @description
 * Loads the private linto-saas plugin (entitlements engine, usage ledger,
 * Stripe billing) and mounts its routers. Enabled only when "CloudService" is
 * in process.env.COMPONENTS, so the open-source build is unaffected.
 *
 * The plugin connects mongoose to the SAME Mongo DB as studio (via the shared
 * DB_HOST/DB_PORT/DB_NAME env), storing its data in the saas_* collections.
 *
 * The /cloud JSON API is mounted BEHIND studio's auth guards (buildGuards) so
 * every org-scoped / backoffice route is authenticated and authorized. The
 * Stripe webhook router is mounted separately (raw body, Stripe-signature
 * verified) and is intentionally NOT behind JWT auth.
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

    // JSON API (behind studio auth guards) + Stripe webhook (raw body) routers.
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
