const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations:admin')
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const {
  OrganizationUnsupportedMediaType,
  OrganizationError,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const TYPES = organizationModel.getTypes()

async function updateOrganization(req, res, next) {
  try {
    if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

    let organization = await orgaUtility.getOrganization(req.params.organizationId, res)
    if (req.body.token) organization.token = req.body.token
    if (req.body.description) organization.description = req.body.description
    if (req.body.name) organization.name = req.body.name
    if (TYPES.asType(req.body.type)) organization.type = req.body.type

    const result = await organizationModel.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError()

    res.status(200).send({
      message: 'Organization has been updated'
    })

  } catch (err) {
    res.status(err.status).send({ message: err.message })
  }
}

async function deleteOrganization(req, res, next) {
  try {
    if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()
    const organization = await orgaUtility.getOrganization(req.params.organizationId)

    if (organization.personal === true) throw new OrganizationError('Personal organization cannot be deleted')
    const result = await organizationModel.deleteById(organization._id.toString())

    if (result.deletedCount !== 1) throw new OrganizationError('Error when deleting organization')

    res.status(200).send({
      message: 'Organization has been deleted'
    })
  } catch (err) {
    res.status(err.status).send({ message: err.message })
  }
}


module.exports = {
  updateOrganization,
  deleteOrganization
}