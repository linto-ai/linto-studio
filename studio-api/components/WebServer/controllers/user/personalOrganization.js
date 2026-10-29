const model = require(`${process.cwd()}/lib/mongodb/models`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)

// Same personal organization as a regular signup, created once
async function ensurePersonalOrganization(user) {
  if (process.env.DISABLE_DEFAULT_ORGANIZATION_CREATION === "true") return
  const personal = await model.organizations.getPersonalByOwner(user._id)
  if (personal) return
  throwIfError(
    await model.organizations.createDefault(user._id.toString(), user.email),
  )
}

module.exports = { ensurePersonalOrganization }
