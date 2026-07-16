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
}

async function checkAccess(req, role) {
  try {
    const { userId } = req.payload.data
    const user = await model.users.getById(userId, true)
    if (user.length === 0) return false

    const userRole = user[0].role
    if (userRole && ROLE.hasPlatformRoleAccess(userRole, role)) {
      if (ROLE.ORGANIZATION_INITIATOR === role) {
        return true
      } else if (
        req.query.userScope === "backoffice" ||
        req.query.userScope === "backoffice-readonly"
      ) {
        grantBackofficeAccess(req)
        return true
      } else {
        return false
      }
    }

    return false
  } catch (err) {
    return false
  }
}

function grantBackofficeAccess(req) {
  req.backofficeAccess = true
  // scope sent during organization impersonation: read bypasses only
  req.backofficeReadOnly = req.query.userScope === "backoffice-readonly"
  req.userRole = ORGANIZATION_ROLE.ADMIN
}
