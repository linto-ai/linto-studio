const model = require(`${process.cwd()}/lib/mongodb/models`)
const VALIDITY_DATE = require(
  `${process.cwd()}/lib/dao/validityDate/validityDate.js`,
)
const { UserError, UserUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)
const { isEmail } = require(`${process.cwd()}/lib/utility/emailDomain`)

// Creates an invited account with its magic link and personal organization.
// Returns { id, magicId }, magicId null when the account needs no link.
async function inviteNewUser(email) {
  if (process.env.DISABLE_USER_INVITATION === "true")
    throw new UserError("User invitation is disabled")
  if (!isEmail(email))
    throw new UserUnsupportedMediaType("Invalid email address")
  // Invitation emails announce a 48h link
  const createdUser = await model.users.createExternal(
    { email },
    false,
    VALIDITY_DATE.LONG,
  )
  if (createdUser.insertedCount !== 1) throw new UserError()
  const id = createdUser.insertedId.toString()
  // An invited account joins an existing workspace, no onboarding wizard
  throwIfError(await model.users.update({ _id: id, onboarded: true }))

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

// Needs the private fields, fetch the user with serverAccess
function isPendingAccount(user) {
  return !user.passwordHash && !user.fromSso && !user.emailIsVerified
}

async function renewInvitationLink(user) {
  const renewed = throwIfError(
    await model.users.renewAuthLink(user, VALIDITY_DATE.LONG),
  )
  if (renewed.matchedCount === 0) throw new UserError()
  return renewed.data.magicId
}

// magicId is null when the account is already active
async function resolveInvitee(email) {
  const existing = throwIfError(await model.users.getByEmail(email, true))
  if (existing.length === 0)
    return { ...(await inviteNewUser(email)), private: false }

  const user = existing[0]
  const id = user._id.toString()
  if (isPendingAccount(user))
    return {
      id,
      magicId: await renewInvitationLink(user),
      private: user.private,
    }
  return { id, magicId: null, private: user.private }
}

module.exports = { inviteNewUser, resolveInvitee }
