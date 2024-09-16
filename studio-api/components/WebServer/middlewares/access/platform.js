const debug = require("debug")(
  "linto:conversation-manager:components:webserver:middlewares:access:platform",
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
  isSuperAdmin: (req) => checkAccess(req, ROLE.SUPER_ADMINISTRATOR),
  isSystemAdministrator: (req) => checkAccess(req, ROLE.SYSTEM_ADMINISTRATOR),
  isSessionOperator: (req) => checkAccess(req, ROLE.SESSION_OPERATOR),
}

async function checkAccess(req, role) {
  try {
    const { userId } = req.payload.data
    const user = await model.users.getById(userId, true)
    if (user.length === 0) return false

    const userRole = user[0].role
    if (userRole && ROLE.hasPlatformRoleAccess(userRole, role)) {
      await impersonateUser(req) // Only impersonate if the user has a super role
      return true
    }

    return false
  } catch (err) {
    return false
  }
}

async function impersonateUser(req) {
  const { organizationId, conversationId } = req.params

  if (organizationId) {
    await setOrganizationOwnerAsUser(req, organizationId)
  } else if (conversationId) {
    const conversation = await model.conversations.getById(conversationId)
    if (conversation.length > 0) {
      const orgId = conversation[0].organization.organizationId
      await setOrganizationOwnerAsUser(req, orgId)
    }
  }
}

async function setOrganizationOwnerAsUser(req, organizationId) {
  const organization = await model.organizations.getById(organizationId)
  if (organization.length > 0) {
    req.userRole = ORGANIZATION_ROLE.ADMIN
    req.payload.data.userId = organization[0].owner
  }
}
