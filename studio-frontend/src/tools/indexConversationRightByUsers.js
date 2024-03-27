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
      organizationMembers,
      true
    )
  }

  const neededCount = listOfconversationRights.length

  for (const [key, value] of externalMembers) {
    if (value.count < neededCount) {
      externalMembers.delete(key)
    }
    // remove count key
    delete value.count
  }

  return {
    external_members: externalMembers,
    organization_members: organizationMembers,
  }
}

function indexConversationRightSubKey(
  usersList,
  indexedUsers,
  keepZero = false
) {
  for (const user of usersList) {
    if (user.right === 0 && !keepZero) {
      continue
    }

    if (
      indexedUsers.has(user._id) &&
      indexedUsers.get(user._id)?.right != user.right
    ) {
      indexedUsers.set(user._id, {
        ...user,
        right: -1,
        count: indexedUsers.get(user._id).count + 1,
      })
      continue
    }

    if (indexedUsers.has(user._id)) {
      indexedUsers.set(user._id, {
        ...user,
        count: indexedUsers.get(user._id).count + 1,
      })
      continue
    }

    indexedUsers.set(user._id, { ...user, count: 1 })
  }
  return indexedUsers
}
