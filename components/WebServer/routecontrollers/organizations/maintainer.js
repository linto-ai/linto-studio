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
      throw new OrganizationError('User is already in ' + organization.name + ' organization')

    organization.users.push({
      userId: user.userId,
      role: parseInt(req.body.role),
      visibility: TYPES.public
    })

    const result = await organizationModel.update(organization)
    if (result !== 'success') throw new OrganizationError()

    res.status(200).send({
      msg: 'Added a user to the organization'
    })
  } catch (err) {
    if (err.error === 'no_match') res.status(304).send({ message: 'Organization unchanged' })
    else res.status(err.status).send({ message: err.message })
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
      throw new OrganizationError('User is not part of the ' + organization.name + ' organization')

    organization.users.map(oUser => {
      if (oUser.userId === req.body.userId) {
        oUser.role = parseInt(req.body.role)
        return
      }
    })

    const result = await organizationModel.update(organization)
    if (result !== 'success') throw new OrganizationError('Error while updating user in organization')

    res.status(200).send({
      msg: 'Updated user role from the organization'
    })
  } catch (err) {
    if (err.error === 'no_match') res.status(304).send({ message: 'Organization unchanged' })
    else res.status(err.status).send({ message: err.message })
  }
}

async function deleteUserFromOrganization(req, res, next) {
  try {
    if (!req.params.organizationId || !req.body.userId) throw new OrganizationUnsupportedMediaType()

    let organization = await orgaUtility.getOrganization(req.params.organizationId)
    if (organization.users.filter(oUser => (oUser.userId === req.body.userId &&
      ROLES.asRevokeRoleAccess(oUser.role, req.userRole))).length === 0)
      throw new OrganizationError('User is not in the ' + organization.name + ' organization')

    organization.users = organization.users.filter(oUser => oUser.userId !== req.body.userId)
    const result = await organizationModel.update(organization)

    if (result !== 'success') throw new OrganizationError()

    res.status(200).send({
      msg: 'Removed user from organization'
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
