import RIGHTS from "../const/userRights.js"

const OWNER_RIGHT =
  RIGHTS.READ + RIGHTS.COMMENT + RIGHTS.WRITE + RIGHTS.DELETE + RIGHTS.SHARE

export function getUserRightFromConversation(conversation, userId) {
  if (userId && conversation.owner === userId) return OWNER_RIGHT

  if (conversation.userAccess && conversation.userAccess.right) {
    return conversation.userAccess.right
  }

  const customRights = conversation.customRights
  if (customRights) {
    let userCustomRight = customRights.find((right) => right.userId === userId)
    if (userCustomRight) return userCustomRight.right
  }

  const customRightsInOrga = conversation.organization.customRights
  const defaultRights = conversation.organization.membersRight

  let userCustomRightInOrga = customRightsInOrga.find(
    (right) => right.userId === userId,
  )
  if (userCustomRightInOrga) return userCustomRightInOrga.right

  return defaultRights
}
