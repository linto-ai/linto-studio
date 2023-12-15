export function indexConversationRightByUsers(listOfconversationRights) {
  let externalMembers = new Map()
  let organizationMembers = new Map()

  for (const convRights of listOfconversationRights) {
    externalMembers = indexConversationRightSubKey(
      convRights.member.external_members,
      externalMembers
    )
    organizationMembers = indexConversationRightSubKey(
      convRights.member.organization_members,
      organizationMembers
    )
  }
  return {
    external_members: externalMembers,
    organization_members: organizationMembers,
  }
}

function indexConversationRightSubKey(value, indexed) {
  for (const user of value) {
    if (indexed.has(user._id) && indexed.get(user._id)?.right != user.right) {
      indexed.set(user._id, { ...user, right: -1 })
      continue
    }

    indexed.set(user._id, user)
  }
  return indexed
}
