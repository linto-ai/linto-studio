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
  isSuperAdmin: (req) => checkAccess(req, ROLE.SUPER_ADMINISTRATOR),
  isSystemAdministrator: (req) => checkAccess(req, ROLE.SYSTEM_ADMINISTRATOR),
  isSessionOperator: (req) => checkAccess(req, ROLE.SESSION_OPERATOR),
  isOrganizationInitiator: (req) =>
    checkAccess(req, ROLE.ORGANIZATION_INITIATOR),
  isReadOnlyScope,
}

async function checkAccess(req, role) {
  try {
    const { userId } = req.payload.data
    const user = await model.users.getById(userId, true)
    if (user.length === 0) return false

    const userRole = user[0].role
    if (userRole && ROLE.hasPlatformRoleAccess(userRole, role)) {
      switch (true) {
        case ROLE.ORGANIZATION_INITIATOR === role:
          return true

        case isReadOnlyScope(req) && req.method === "GET":
        case req.query.userScope === "backoffice":
          grantBackofficeAccess(req)
          return true

        default:
          return false
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
