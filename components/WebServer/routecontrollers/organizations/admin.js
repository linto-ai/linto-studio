const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations:admin')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const { getStorageFolder, getAudioFolder, deleteFile } = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  OrganizationUnsupportedMediaType,
  OrganizationError,
  OrganizationConflict
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

const { ConversationError } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function updateOrganization(req, res, next) {
  try {
    if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

    let organization = await model.organizations.getById(req.params.organizationId)
    if (organization.length === 0) throw new OrganizationError('Organization not found')
    organization = organization[0]

    const isOrgaFound = await model.organizations.getByName(req.body.name)
    if (isOrgaFound.length === 1) throw new OrganizationConflict('Organization name already exists')

    if (req.body.token) organization.token = req.body.token
    if (req.body.description) organization.description = req.body.description
    if (req.body.name) organization.name = req.body.name

    const result = await model.organizations.update(organization)
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

    let organization = await model.organizations.getById(req.params.organizationId)
    if (organization.length === 0) throw new OrganizationError('Organization not found')
    organization = organization[0]

    let lconv = await model.conversations.getByOrga(req.params.organizationId)
    lconv.map(async conv => {
      const result = await model.conversations.delete(conv._id)
      if (result.deletedCount !== 1) throw new ConversationError('Error while deleting conversation from organization')

      try {
        const audioFilename = conversation.metadata.audio.filepath.split('/').pop()
        const jsonFilename = audioFilename.split('.')[0] + '.json'
        deleteFile(`${getStorageFolder()}/${conv.metadata.audio.filepath}`)
        deleteFile(`${getStorageFolder()}/${getAudioWaveformFolder()}/${jsonFilename}`)

      } catch (err) {
        debug(`file not found ${getStorageFolder()}/${conv.metadata.audio.filepath}`)
      }

    })

    const result = await model.organizations.delete(organization._id.toString())
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