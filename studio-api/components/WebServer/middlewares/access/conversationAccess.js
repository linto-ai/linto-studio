const model = require(`${process.cwd()}/lib/mongodb/models`)

const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)
const ORGANIZATION_ROLES = require(
  `${process.cwd()}/lib/dao/organization/roles`,
)

const projection = ["owner", "sharedWithUsers", "organization"]

/**
 * Check if a user has write access to a conversation.
 * Standalone function (no Express req/res/next).
 * @param {string} conversationId
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
async function hasWriteAccess(conversationId, userId) {
  const lconv = await model.conversations.getById(conversationId, projection)
  if (lconv.length !== 1) return false

  const conv = lconv[0]

  // Owner has full access
  if (conv.owner === userId) return true

  // No organization = no shared access
  if (conv.organization.organizationId === undefined) return false

  // Check shared users
  if (conv.sharedWithUsers.length > 0) {
    const ushare = conv.sharedWithUsers.filter(
      (userShare) =>
        userShare.userId === userId &&
        CONVERSATION_RIGHTS.hasRightAccess(
          userShare.right,
          CONVERSATION_RIGHTS.WRITE,
        ),
    )
    if (ushare.length === 1) return true
  }

  // Check organization access
  const lorga = await model.organizations.getById(
    conv.organization.organizationId,
  )
  if (lorga.length !== 1) return false

  const luser = lorga[0].users.filter((user) => user.userId === userId)
  if (luser.length !== 1) return false

  const user = luser[0]

  // Maintainer or above
  if (
    ORGANIZATION_ROLES.hasRoleAccess(user.role, ORGANIZATION_ROLES.MAINTAINER)
  ) {
    return true
  }

  // Custom rights for specific member
  if (conv.organization.customRights.length > 0) {
    const customRight = conv.organization.customRights.filter(
      (cr) => cr.userId === userId,
    )
    if (
      customRight.length === 1 &&
      CONVERSATION_RIGHTS.hasRightAccess(
        customRight[0].right,
        CONVERSATION_RIGHTS.WRITE,
      )
    ) {
      return true
    }
  }

  // Default member right
  if (
    CONVERSATION_RIGHTS.hasRightAccess(
      conv.organization.membersRight,
      CONVERSATION_RIGHTS.WRITE,
    )
  ) {
    return true
  }

  return false
}

module.exports = { hasWriteAccess }
