const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations:maitainer')
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)
const userUtility = require(`${process.cwd()}/components/WebServer/controllers/user/utility`)

const {
  OrganizationError,
  OrganizationUnsupportedMediaType,
  OrganizationForbidden,
  OrganizationNotFound,
  OrganizationConflict
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const TYPES = organizationModel.getTypes()
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

async function addUserInOrganization(req, res, next) {
  try {

    if (!req.params.organizationId || !req.body.email || !req.body.role)
      throw new OrganizationUnsupportedMediaType()

    if (isNaN(req.body.role) && TYPES.checkValue(req.body.role)) throw new OrganizationUnsupportedMediaType("Role value is not valid")
    if (ROLES.canGiveAccess(req.body.role, req.userRole)) throw new OrganizationForbidden()

    let organization = await orgaUtility.getOrganization(req.params.organizationId)
    const user = await userUtility.getUser(req.body.email)

    if (organization.users.filter(oUser => oUser.userId === user.userId).length !== 0)
      throw new OrganizationConflict(req.body.email + ' is already in ' + organization.name)

    organization.users.push({
      userId: user.userId,
      role: parseInt(req.body.role),
      visibility: TYPES.public
    })

    const result = await organizationModel.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError()

    res.status(201).send({
      message: req.body.email + ' has been added to the organization'
    })
  } catch (err) {
    next(err)
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

    const data = orgaUtility.countAdmin(organization, req.body.userId)
    if (data.adminCount === 1 && data.isAdmin) throw new OrganizationForbidden('You cannot change the last admin role')

    const result = await organizationModel.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError('Error while updating user in organization')

    res.status(200).send({
      message: 'Updated user from the organization'
    })
  } catch (err) {
    next(err)
  }
}

async function deleteUserFromOrganization(req, res, next) {
  try {
    if (!req.params.organizationId || !req.body.userId) throw new OrganizationUnsupportedMediaType()

    let organization = await orgaUtility.getOrganization(req.params.organizationId)
    let user = organization.users.filter(oUser => oUser.userId === req.body.userId)

    if (user.length === 0) throw new OrganizationNotFound('User is not in ' + organization.name)
    if (!ROLES.hasRevokeRoleAccess(user[0].role, req.userRole)) throw new OrganizationForbidden()// Update role need to be lower or equal than my current role

    const data = orgaUtility.countAdmin(organization, req.body.userId)
    if (data.adminCount === 1 && data.isAdmin) throw new OrganizationForbidden('You cannot delete the last admin')

    organization.users = organization.users.filter(oUser => oUser.userId !== req.body.userId)
    const result = await organizationModel.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError()

    res.status(200).send({
      message: 'User has been deleted from the organization'
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  addUserInOrganization,
  updateUserFromOrganization,
  deleteUserFromOrganization
}
