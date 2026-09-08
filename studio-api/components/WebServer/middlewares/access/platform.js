const debug = require("debug")(
  "linto:components:WebServer:middlewares:access:platform",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const ORGANIZATION_ROLE = require(`${process.cwd()}/lib/dao/organization/roles`)

const { UserForbidden, UserNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)

module.exports = {
  isPlatformAdmin: async (req, res, next) => {
    if (await checkAccess(req, ROLE.SUPER_ADMINISTRATOR)) next()
    else next(new UserForbidden())
  },
  isPlatformSystemAdministrator: async (req, res, next) => {
    if (await checkAccess(req, ROLE.SYSTEM_ADMINISTRATOR)) next()
    else next(new UserForbidden())
  },
  isPlatformSessionOperator: async (req, res, next) => {
    if (await checkAccess(req, ROLE.SESSION_OPERATOR)) next()
    else next(new UserForbidden())
  },
  isPlatformOrganizationInitiator: async (req, res, next) => {
    if (await checkAccess(req, ROLE.ORGANIZATION_INITIATOR)) next()
    else next(new UserForbidden())
  },
  // Identity bridge callers: an INTEGRATION credential (its own platform bit,
  // no scope needed), or a SYSTEM_ADMINISTRATOR acting with the backoffice
  // scope (`?userScope=backoffice`) — the dev / transition credential.
  isPlatformIntegration: async (req, res, next) => {
    if (await checkIntegrationAccess(req)) next()
    else next(new UserForbidden("Integration credential required"))
  },
  isSuperAdmin: (req) => checkAccess(req, ROLE.SUPER_ADMINISTRATOR),
  isSystemAdministrator: (req) => checkAccess(req, ROLE.SYSTEM_ADMINISTRATOR),
  isSessionOperator: (req) => checkAccess(req, ROLE.SESSION_OPERATOR),
  isOrganizationInitiator: (req) =>
    checkAccess(req, ROLE.ORGANIZATION_INITIATOR),
  isReadOnlyScope,
}

async function checkIntegrationAccess(req) {
  try {
    const { userId } = req.payload.data
    const user = await model.users.getById(userId, true)
    if (user.length === 0) return false
    if (ROLE.hasPlatformRoleAccess(user[0].role, ROLE.INTEGRATION)) return true
  } catch (err) {
    return false
  }
  return checkAccess(req, ROLE.SYSTEM_ADMINISTRATOR)
}

async function checkAccess(req, role) {
  try {
    const { userId } = req.payload.data
    const user = await model.users.getById(userId, true)
    if (user.length === 0) return false

    const userRole = user[0].role
    if (userRole && ROLE.hasPlatformRoleAccess(userRole, role)) {
      if (role === ROLE.ORGANIZATION_INITIATOR) return true

      if (
        req.query.userScope === "backoffice" ||
        (isReadOnlyScope(req) && req.method === "GET")
      ) {
        grantBackofficeAccess(req)
        return true
      }
    }

    return false
  } catch (err) {
    return false
  }
}

// scope sent during organization impersonation: read bypasses only
function isReadOnlyScope(req) {
  return req.query.userScope === "backoffice-readonly"
}

function grantBackofficeAccess(req) {
  req.backofficeAccess = true
  req.backofficeReadOnly = isReadOnlyScope(req)
  req.userRole = ORGANIZATION_ROLE.ADMIN
}
