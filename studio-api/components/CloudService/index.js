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
const saas = require(`${process.cwd()}/lib/saas`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)
const orgaUtility = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

// A never-paid org is dropped once every Checkout session that could still
// reference it has expired (Stripe expires them after 24 h).
const PENDING_ORG_MAX_AGE_MS = 48 * 3600 * 1000
const PENDING_ORG_SWEEP_MS = 3600 * 1000

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

    // null on failure so the plugin falls back to the request instead of
    // mis-billing.
    resolveSeats: async (orgId) => {
      try {
        const orgs = await model.organizations.getById(orgId)
        if (!orgs || orgs.length !== 1) return null
        return saas.requiredSeats(orgs[0])
      } catch (e) {
        return null
      }
    },
  }
}

// Organization hooks of the plugin (SPEC-SAAS §3.2 pending org, §4.2 lock)
function buildOrganizationHooks() {
  return {
    // false = team org (bought with a plan or created under one): the plugin
    // locks it out while it has no team plan. null when the org is unknown.
    isPersonal: async (orgId) => {
      const rows = throwIfError(
        await model.organizations.getByIdFilter(orgId, { personal: 1 }),
      )
      if (rows.length !== 1) return null
      return rows[0].personal !== false
    },
    // A plan sold with its own organization (Business): the org exists, hidden,
    // before Checkout so Stripe metadata can carry its id; the webhook reveals it.
    createPending: async ({ ownerUserId, name, invitations, origin }) => {
      if (!ownerUserId) {
        throw new Error("CloudService: createPending needs the caller userId")
      }
      return throwIfError(
        await model.organizations.createPending(ownerUserId, name, {
          invitations,
          origin,
        }),
      )
    },
    activate: async (orgId) => {
      const rows = throwIfError(await model.organizations.getById(orgId))
      if (rows.length !== 1) return false
      const changed = throwIfError(
        await model.organizations.activatePending(orgId),
      )
      // Member inserts and mails stay off the webhook's critical path
      if (changed) {
        invitePendingMembers(rows[0]).catch((err) =>
          logger.error(
            `[saas] org ${orgId}: invitations failed: ${err && err.message}`,
          ),
        )
      }
      return changed
    },
  }
}

// Invitations captured at checkout, sent once the org is paid, as uploaders
// (the seats bought with them). A failed invitation is logged and skipped.
async function invitePendingMembers(org) {
  const { pendingCheckout, ...activated } = org
  const invitations = (pendingCheckout && pendingCheckout.invitations) || []
  if (invitations.length === 0) return
  const orgId = activated._id.toString()

  const owner = throwIfError(await model.users.getById(activated.owner))
  const inviterEmail = owner[0] ? owner[0].email : null
  for (const email of invitations) {
    try {
      await orgaUtility.inviteMemberByEmail({
        organization: activated,
        email,
        role: ROLES.UPLOADER,
        inviterEmail,
        origin: pendingCheckout.origin,
      })
    } catch (err) {
      logger.error(
        `[saas] org ${orgId}: could not invite ${email}: ${err && err.message}`,
      )
    }
  }
}

async function sweepPendingOrganizations() {
  const before = new Date(Date.now() - PENDING_ORG_MAX_AGE_MS)
  const rows = throwIfError(await model.organizations.listPendingBefore(before))
  for (const org of rows) {
    try {
      await orgaUtility.deleteOrganizationCascade(org._id.toString())
      logger.info(`[saas] dropped never-paid organization ${org._id}`)
    } catch (err) {
      logger.error(
        `[saas] could not drop never-paid organization ${org._id}: ${err && err.message}`,
      )
    }
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
      organizations: buildOrganizationHooks(),
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

    // Webhook first: the /cloud router parses JSON, which would consume the
    // raw body Stripe signs.
    this.app.components.WebServer.express.use(
      "/cloud/webhook",
      this.paymentProcessor.webhookRouter(),
    )
    this.app.components.WebServer.express.use(
      "/cloud",
      this.paymentProcessor.apiRouter(buildGuards()),
    )

    this.pendingOrgSweep = setInterval(() => {
      sweepPendingOrganizations().catch((err) =>
        logger.error(
          `[saas] pending organization sweep failed: ${err && err.message}`,
        ),
      )
    }, PENDING_ORG_SWEEP_MS)
    if (this.pendingOrgSweep.unref) this.pendingOrgSweep.unref()

    return this
  }
}

module.exports = (app) => new CloudService(app)
