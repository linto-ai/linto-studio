import { getUserRightFromConversation } from "../../tools/getUserRightFromConversation.js"
import RIGHTS from "../../const/userRights.js"
import { ORGANIZATION_ROLES } from "../../const/organizationRoles.js"

/**
 * Same rule as the classic share panel: organization maintainers and
 * administrators share anything, other users need the delete right.
 * @param {object|null} conversation - list item with its organization block
 * @param {string} userId
 * @param {number} organizationRole
 * @returns {boolean}
 */
export function canShareConversation(conversation, userId, organizationRole) {
  if (!conversation) return false
  if (organizationRole >= ORGANIZATION_ROLES.MAINTAINER) return true
  if (!Array.isArray(conversation.organization?.customRights)) return false
  const right = getUserRightFromConversation(conversation, userId)
  return RIGHTS.hasRightAccess(right, RIGHTS.DELETE)
}
