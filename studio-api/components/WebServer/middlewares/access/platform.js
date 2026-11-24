const debug = require("debug")(
  "linto:components:WebServer:middlewares:access:platform",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const ORGANIZATION_ROLE = require(`${process.cwd()}/lib/dao/organization/roles`)
const { firstOf } = require(`${process.cwd()}/lib/utility/firstOf`)

const { UserForbidden } = require(
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
  callerOf,
}

const CALLER_PROJECTION = {
  type: 1,
  role: 1,
  "metadata.externalIdentity": 1,
  "metadata.organizationId": 1,
  "metadata.quickMeeting": 1,
}

async function callerOf(req) {
  if (req.caller === undefined) {
    req.caller = firstOf(
      await model.users.getByIdFilter(
        req.payload.data.userId,
        CALLER_PROJECTION,
      ),
    )
  }
  return req.caller
}

async function checkAccess(req, role) {
  try {
    const user = await callerOf(req)
    if (!user) return false

    const userRole = user.role
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
