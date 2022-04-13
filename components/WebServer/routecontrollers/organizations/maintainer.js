const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations:maitainer')
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const {
  OrganizationError,
  OrganizationUnsupportedMediaType,
  OrganizationForbidden,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const TYPES = organizationModel.getTypes()
const ROLES = require(`${process.cwd()}/lib/dao/roles/organization`)

async function addUserInOrganization(req, res, next) {
  try {

    if (!req.params.organizationId || !req.body.email || !req.body.role)
      throw new OrganizationUnsupportedMediaType()

    if (isNaN(req.body.role) && TYPES.checkValue(req.body.role)) throw new OrganizationUnsupportedMediaType("Role value is not valid")
    if (ROLES.canGiveAccess(req.body.role, req.userRole)) throw new OrganizationForbidden()

    let organization = await orgaUtility.getOrganization(req.params.organizationId)
    const user = await orgaUtility.getUser(req.body.email)

    if (organization.users.filter(oUser => oUser.userId === user.userId).length !== 0)
      throw new OrganizationError(req.body.email + ' is already in ' + organization.name)

    organization.users.push({
      userId: user.userId,
      role: parseInt(req.body.role),
      visibility: TYPES.public
    })

    const result = await organizationModel.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError()

    res.status(200).send({
      message: req.body.email + ' has been added to the organization'
    })
  } catch (err) {
    res.status(err.status).send({ message: err.message })
  }
}

async function updateUserFromOrganization(req, res, next) {
  try {
    if (!req.params.organizationId || !req.body.userId || !req.body.role)
      throw new OrganizationUnsupportedMediaType()

    if (isNaN(req.body.role) && TYPES.checkValue(req.body.role)) throw new OrganizationUnsupportedMediaType("Role value is not valid")
    if (ROLES.canGiveAccess(req.body.role, req.userRole)) throw new OrganizationForbidden()

    let organization = await orgaUtility.getOrganization(req.params.organizationId)

    if (organization.users.filter(oUser => oUser.userId === req.body.userId).length === 0)
      throw new OrganizationError('User is not part of the ' + organization.name)

    organization.users.map(oUser => {
      if (oUser.userId === req.body.userId) {
        if (ROLES.hasRoleAccess(req.userRole, oUser.role)) // Update role need to be lower or equal than my current role
          oUser.role = parseInt(req.body.role)
        else throw new OrganizationForbidden()

        return
      }
    })

    const result = await organizationModel.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError('Error while updating user in organization')

    res.status(200).send({
      message: 'Updated user from the organization'
    })
  } catch (err) {
    res.status(err.status).send({ message: err.message })
  }
}

async function deleteUserFromOrganization(req, res, next) {
  try {
    if (!req.params.organizationId || !req.body.userId) throw new OrganizationUnsupportedMediaType()

    let organization = await orgaUtility.getOrganization(req.params.organizationId)
    if (organization.users.filter(oUser => (oUser.userId === req.body.userId &&
      ROLES.hasRevokeRoleAccess(oUser.role, req.userRole))).length === 0)
      throw new OrganizationError('User is not in ' + organization.name)

    organization.users = organization.users.filter(oUser => oUser.userId !== req.body.userId)
    const result = await organizationModel.update(organization)

    if (result.matchedCount === 0) throw new OrganizationError()

    res.status(200).send({
      message: 'Removed user from organization'
    })
  } catch (err) {
    res.status(err.status).send({ message: err.message })
  }
}

module.exports = {
  addUserInOrganization,
  updateUserFromOrganization,
  deleteUserFromOrganization
}
