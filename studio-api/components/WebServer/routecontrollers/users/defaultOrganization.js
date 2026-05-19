const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
  UserNotFound,
  UserUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

const {
  OrganizationNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

async function setDefaultOrganization(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const { organizationId } = req.body

    if (!organizationId) throw new UserUnsupportedMediaType()

    const organization = await model.organizations.getByIdAndUser(
      organizationId,
      userId,
    )
    if (!organization || organization.length === 0)
      throw new OrganizationNotFound()

    const result = await model.users.update({
      _id: userId,
      defaultOrganization: organizationId,
    })

    if (result.matchedCount === 0) throw new UserNotFound()
    res.status(200).send({ message: "Default organization updated" })
  } catch (err) {
    next(err)
  }
}

async function unsetDefaultOrganization(req, res, next) {
  try {
    const userId = req.payload.data.userId

    const result = await model.users.update({
      _id: userId,
      defaultOrganization: null,
    })

    if (result.matchedCount === 0) throw new UserNotFound()
    res.status(200).send({ message: "Default organization removed" })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  setDefaultOrganization,
  unsetDefaultOrganization,
}
