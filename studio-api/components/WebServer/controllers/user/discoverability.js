const model = require(`${process.cwd()}/lib/mongodb/models`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)

// Co-members and people who shared a conversation with the user
async function reachableUserIds(userId) {
  const id = userId.toString()
  const [organizations, conversations] = await Promise.all([
    model.organizations.listByMember(id),
    model.conversations.listSharedWithUser(id),
  ])

  const members = throwIfError(organizations).flatMap((organization) =>
    organization.users.map((member) => member.userId),
  )
  // Imported shares may carry no sharedBy, the owner is always set
  const sharers = throwIfError(conversations).map(
    (conversation) =>
      conversation.sharedWithUsers[0].sharedBy ?? conversation.owner,
  )
  return new Set([id, ...members, ...sharers])
}

module.exports = { reachableUserIds }
