const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:organizations",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

const {
  OrganizationError,
  OrganizationUnsupportedMediaType,
  OrganizationConflict,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

async function listAllOrganization(req, res, next) {
  try {
    const organizations = await model.organizations.getAll(req.query)
    return res.status(200).send(organizations)
  } catch (err) {
    next(err)
  }
}

async function createOrganization(req, res, next) {
  try {
    const { owner, name } = req.body

    if (!owner || !name) throw new OrganizationUnsupportedMediaType()

    const isOrgaFound = await model.organizations.getByName(name)
    if (isOrgaFound.length === 1) throw new OrganizationConflict()

    const isUserFound = await model.users.getById(owner)
    if (isUserFound.length !== 1)
      throw new OrganizationError("Desired owner not found")
    let organization = {
      name: name,
      description: req.body.description ? req.body.description : "",
      users: [{ userId: owner, role: ROLES.ADMIN }],
      owner: owner,
      token: "",
      permissions: {},
    }

    organization.permissions = PERMISSIONS.validateAndSetDefaultPermissions(
      req.body.permissions,
    )
    const result = await model.organizations.createOrgaByAdmin(organization)
    if (result.insertedCount !== 1) throw new OrganizationError()

    const orga_created = await model.organizations.getById(
      result.insertedId.toString(),
    )
    return res.status(201).send(orga_created[0])
  } catch (err) {
    next(err)
  }
}

async function updateOrganizationPlatform(req, res, next) {
  try {
    const { organizationId } = req.params
    const { name, token, description, permissions } = req.body

    // Check if organizationId is provided
    if (!organizationId) {
      throw new OrganizationUnsupportedMediaType()
    }

    // Fetch the organization by ID
    let organization = await model.organizations.getById(organizationId)
    if (organization.length === 0) {
      throw new OrganizationError("Organization not found")
    }
    organization = organization[0]

    // Check for unique name if it is provided and different from the current name
    if (name && name !== organization.name) {
      const isOrgaFound = await model.organizations.getByName(name)
      if (
        isOrgaFound.length === 1 &&
        organization._id.toString() !== isOrgaFound[0]._id.toString()
      ) {
        throw new OrganizationConflict("Organization name already exists")
      }
    }

    // Update the organization fields only if provided
    if (token) organization.token = token
    if (description) organization.description = description
    if (name) organization.name = name
    if (permissions)
      organization.permissions = PERMISSIONS.validateAndSetDefaultPermissions(
        permissions,
        organization.permissions,
      )

    // Update organization in the database
    const result = await model.organizations.updateOrgaByAdmin(organization)
    if (result.matchedCount === 0) {
      throw new OrganizationError("Failed to update organization")
    }

    res.status(200).send({
      message: "Organization has been updated",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listAllOrganization,
  createOrganization,
  updateOrganizationPlatform,
}
