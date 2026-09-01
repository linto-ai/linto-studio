const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organizations:organizations",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const PLATFORM_ROLES = require(`${process.cwd()}/lib/dao/users/platformRole`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)

const { OrganizationError, OrganizationUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)
const { SaasFeatureLocked } = require(
  `${process.cwd()}/components/WebServer/error/exception/saas`,
)
const saas = require(`${process.cwd()}/lib/saas`)
const { requireParam } = require(`${process.cwd()}/lib/utility/requireParam`)

async function createOrganization(req, res, next) {
  try {
    requireParam(req.body.name, OrganizationUnsupportedMediaType)

    // PAID GATE (SaaS only): creating an EXTRA organization (a "workspace") is a
    // paid-plan feature, layered on top of the route's requireOrganizationInitiatorAccess
    // right. We bill against the caller's personal/master org (the subscription
    // subject), since the new org has no plan yet. FAIL-CLOSED: when SaaS is on
    // and we cannot resolve a billing subject, deny — a billing gate must never
    // fail open. No-op in the OSS build (saas.enabled() === false). See lib/saas.
    if (saas.enabled()) {
      let personalOrg = null
      try {
        personalOrg = await model.organizations.getPersonalByOwner(
          req.payload.data.userId,
        )
      } catch (err) {
        throw new SaasFeatureLocked("Cannot resolve billing subject", {
          reason: "feature_disabled",
          capability: "organization.create",
        })
      }
      if (!personalOrg || !personalOrg._id) {
        throw new SaasFeatureLocked("No billing subject for org creation", {
          reason: "feature_disabled",
          capability: "organization.create",
        })
      }
      await saas.enforce({
        orgId: String(personalOrg._id),
        capability: "organization.create",
      })
    }

    const organization = {
      name: req.body.name,
      description: req.body.description ? req.body.description : "",
      users: [{ userId: req.payload.data.userId, role: ROLES.ADMIN }],
      owner: req.payload.data.userId,
      token: "",
    }

    if (!!req.body.users) organization.users.push(...req.body.users)

    const result = await model.organizations.create(organization)
    if (result.insertedCount !== 1) throw new OrganizationError()

    const orga_created = await model.organizations.getById(
      result.insertedId.toString(),
    )

    const orga = orga_created[0]

    return res.status(201).send(orga)
  } catch (err) {
    next(err)
  }
}

async function getOrganization(req, res, next) {
  try {
    const lorganization = await model.organizations.getByIdAndUser(
      req.params.organizationId,
      req.payload.data.userId,
      { bypass: req.backofficeAccess },
    )
    if (lorganization.length !== 1) throw new OrganizationError()

    let organization = lorganization[0]

    // M2M users (API keys) are excluded by default to preserve the
    // legacy contract: most UIs (members listing, permission pickers)
    // only want human members. Opt-in via ?includeM2m=true when the
    // caller needs to resolve a conversation/media owner that may be
    // an API key.
    const includeM2m =
      req.query.includeM2m === "true" || req.query.includeM2m === true
    if (!includeM2m) {
      organization.users = organization.users.filter(
        (u) => u.type !== USER_TYPE.M2M,
      )
    }

    let orgaUser = []

    for (let luser of organization.users) {
      let user = await model.users.getById(luser.userId)

      orgaUser.push({
        ...user[0],
        ...luser,
      })
    }
    organization.users = orgaUser
    organization.categories = await model.categories.getSystemCategories(
      req.params.organizationId,
    )
    return res.status(200).send(organization)
  } catch (err) {
    next(err)
  }
}

async function listSelfOrganization(req, res, next) {
  try {
    let organizations = await model.organizations.listSelf(
      req.payload.data.userId,
    )
    return res.status(200).send(organizations)
  } catch (err) {
    next(err)
  }
}

async function listAllOrganization(req, res, next) {
  try {
    let user = await model.users.getById(req.payload.data.userId, true)
    let organizations = []
    if (
      PLATFORM_ROLES.hasPlatformRoleAccess(
        user[0].role,
        PLATFORM_ROLES.SYSTEM_ADMINISTRATOR,
      )
    ) {
      organizations = await model.organizations.getAll()
    } else {
      return res.status(401).send({ message: "Unauthorized" })
    }

    return res.status(200).send(organizations)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createOrganization,
  listSelfOrganization,
  listAllOrganization,
  getOrganization,
}
