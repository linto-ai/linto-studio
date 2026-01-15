const debug = require("debug")(
  "linto:conversation-manager:components:webserver:middlewares:access:organization",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const platformAccess = require(`./platform`)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const {
  OrganizationForbidden,
  OrganizationNotFound,
  OrganizationUnsupportedMediaType,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

module.exports = {
  asAdminAccess: async (req, res, next) => {
    if (await platformAccess.isSystemAdministrator(req)) next()
    else
      await access(
        req,
        next,
        req.params.organizationId,
        req.payload.data.userId,
        ROLES.ADMIN,
      )
  },
  asMaintainerAccess: async (req, res, next) => {
    if (await platformAccess.isSystemAdministrator(req)) next()
    else
      await access(
        req,
        next,
        req.params.organizationId,
        req.payload.data.userId,
        ROLES.MAINTAINER,
      )
  },
  asMeetingManagerAccess: async (req, res, next) => {
    if (await platformAccess.isSessionOperator(req)) next()
    else
      await access(
        req,
        next,
        req.params.organizationId,
        req.payload.data.userId,
        ROLES.MEETING_MANAGER,
      )
  },
  asQuickMeetingAccess: async (req, res, next) => {
    if (await platformAccess.isSessionOperator(req)) next()
    else
      await access(
        req,
        next,
        req.params.organizationId,
        req.payload.data.userId,
        ROLES.QUICK_MEETING,
      )
  },
  asUploaderAccess: async (req, res, next) => {
    if (await platformAccess.isSystemAdministrator(req)) next()
    else
      await access(
        req,
        next,
        req.params.organizationId,
        req.payload.data.userId,
        ROLES.UPLOADER,
      )
  },
  asMemberAccess: async (req, res, next) => {
    if (await platformAccess.isSystemAdministrator(req)) return next()
    else
      await access(
        req,
        next,
        req.params.organizationId,
        req.payload.data.userId,
        ROLES.MEMBER,
      )
  },
  access: async (req, next, organizationId, userId, right) => {
    await access(req, next, organizationId, userId, right)
  },
  permissionUpload: async (req, res, next) => {
    await permissionAccess(req, res, next, PERMISSIONS.UPLOAD)
  },
  permissionSummary: async (req, res, next) => {
    await permissionAccess(req, res, next, PERMISSIONS.SUMMARY)
  },
  permissionSession: async (req, res, next) => {
    await permissionAccess(req, res, next, PERMISSIONS.SESSION)
  },
  sessionSocketAccess: async (session, userId) => {
    return await sessionSocketAccess(session, userId, ROLES.MEMBER)
  },
  checkSocketOrganizationAccess,
}

async function permissionAccess(req, res, next, access) {
  let organization
  if (req.params.organizationId) {
    organization = await model.organizations.getById(req.params.organizationId)
  } else if (req.params.conversationId && req.path.endsWith("/download")) {
    const allowDownloadFormat = ["json", "text", "verbatim"]
    if (allowDownloadFormat.includes(req.query.format)) {
      return next()
    }

    const conv = await model.conversations.getById(req.params.conversationId)
    if (conv.length !== 1) return next(new ConversationNotShared())
    organization = await model.organizations.getById(
      conv[0].organization.organizationId,
    )
  }

  if (organization.length !== 1) return next(new OrganizationNotFound())
  if (!PERMISSIONS.hasRightAccess(organization[0].permissions, access))
    return next(
      new OrganizationForbidden(
        "Organization does not have the required permission",
      ),
    )
  else next()
}

async function access(req, next, organizationId, userId, right) {
  try {
    if (!organizationId) {
      return next(new OrganizationUnsupportedMediaType())
    }
    const organization = await model.organizations.getById(organizationId)
    if (organization.length !== 1) return next(new OrganizationNotFound())
    else {
      const isUserFound = organization[0].users.filter(
        (user) =>
          user.userId === userId && ROLES.hasRoleAccess(user.role, right),
      )
      if (isUserFound.length !== 0) {
        if (req) req.userRole = isUserFound[0].role

        return next()
      } else {
        // Special case if the user is owner of an action regarding some conversation
        if (req?.body?.conversationsId) {
          const conv = await model.conversations.listConvFromOwner(
            req.body.conversationsId,
            userId,
          )
          if (conv.length >= 1) {
            return next()
          }
        }
        return next(new OrganizationForbidden())
      }
    }
  } catch (err) {
    return next(err)
  }
}

async function sessionSocketAccess(session, userId, right) {
  try {
    if (!session && session.organizationId) {
      return false
    }
    const organization = await model.organizations.getById(
      session.organizationId,
    )
    if (organization.length !== 1) return false
    else {
      const isUserFound = organization[0].users.filter(
        (user) =>
          user.userId === userId && ROLES.hasRoleAccess(user.role, right),
      )
      if (isUserFound.length !== 0) {
        return true
      } else return false
    }
  } catch (err) {
    return false
  }
}

/**
 * Check if a socket user has access to an organization
 * Used by IoHandler for WebSocket event authorization
 * @param {Socket} socket - Socket.io socket object
 * @param {string} orgaId - Organization ID
 * @returns {Promise<{authorized: boolean, userId?: string}>}
 */
async function checkSocketOrganizationAccess(socket, orgaId) {
  const auth_middlewares = require(
    `${process.cwd()}/components/WebServer/config/passport/middleware`,
  )

  try {
    const { isAuth, userId } = await auth_middlewares.checkSocket(socket)
    if (!isAuth || !userId) {
      return { authorized: false }
    }

    const orgAccess = await model.organizations.getByIdAndUser(orgaId, userId)
    if (!orgAccess || orgAccess.length === 0) {
      return { authorized: false }
    }

    return { authorized: true, userId }
  } catch (err) {
    return { authorized: false }
  }
}
