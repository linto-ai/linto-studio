const model = require(`${process.cwd()}/lib/mongodb/models`)
const { UserError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)

// Creates an invited account with its magic link and personal organization.
// Returns { id, magicId }, magicId null when the account needs no link.
async function inviteNewUser(email) {
  if (process.env.DISABLE_USER_INVITATION === "true")
    throw new UserError("User invitation is disabled")
  const createdUser = await model.users.createExternal({ email })
  if (createdUser.insertedCount !== 1) throw new UserError()
  const id = createdUser.insertedId.toString()

  const invitedUser = await model.users.getById(id, true)
  const magicId = invitedUser[0].authLink.magicId || null
  if (magicId) {
    const createOrganization = await model.organizations.createDefault(
      id,
      email,
      {},
    )
    if (createOrganization.insertedCount !== 1) {
      await model.users.delete(id)
      throw new UserError()
    }
  }
  return { id, magicId }
}

module.exports = { inviteNewUser }
