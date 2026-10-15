const model = require(`${process.cwd()}/lib/mongodb/models`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)

// The first team organization a user joins becomes their default one. Their
// personal organization never does, and an existing choice is kept.
async function adoptDefaultOrganization(userId, organization) {
  if (organization.personal !== false) return false
  const user = throwIfError(
    await model.users.getByIdFilter(userId, { defaultOrganization: 1 }),
  )[0]
  if (!user || user.defaultOrganization) return false
  throwIfError(
    await model.users.update({
      _id: userId,
      defaultOrganization: organization._id.toString(),
    }),
  )
  return true
}

module.exports = { adoptDefaultOrganization }
