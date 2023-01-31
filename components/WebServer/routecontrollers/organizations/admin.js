const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations:admin')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const { getStorageFolder, getAudioFolder, deleteFile } = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  OrganizationUnsupportedMediaType,
  OrganizationError,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const { ConversationError } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function updateOrganization(req, res, next) {
  try {
    if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

    let organization = await model.organization.getById(req.params.organizationId)
    if (organization.length === 0) throw new OrganizationError('Organization not found')
    organization = organization[0]

    if (req.body.token) organization.token = req.body.token
    if (req.body.description) organization.description = req.body.description
    if (req.body.name) organization.name = req.body.name

    const result = await model.organization.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError()

    res.status(200).send({
      message: 'Organization has been updated'
    })

  } catch (err) {
    next(err)
  }
}

async function deleteOrganization(req, res, next) {
  try {
    if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

    let organization = await model.organization.getById(req.params.organizationId)
    if (organization.length === 0) throw new OrganizationError('Organization not found')
    organization = organization[0]

    let lconv = await model.conversation.getByOrga(req.params.organizationId)
    lconv.map(async conv => {
      const result = await model.conversation.deleteById(conv._id)
      if (result.deletedCount !== 1) throw new ConversationError('Error while deleting conversation from organization')

      try {
        deleteFile(`${getStorageFolder()}/${conv.metadata.audio.filepath}`)
      } catch (err) {
        debug(`file not found ${getStorageFolder()}/${conv.metadata.audio.filepath}`)
      }

    })

    const result = await model.organization.deleteById(organization._id.toString())
    if (result.deletedCount !== 1) throw new OrganizationError('Error when deleting organization')

    res.status(200).send({
      message: 'Organization has been deleted'
    })
  } catch (err) {
    next(err)
  }
}


module.exports = {
  updateOrganization,
  deleteOrganization
}