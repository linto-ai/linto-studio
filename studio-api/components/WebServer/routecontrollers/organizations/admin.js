const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organizations:admin",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
  deleteAudioFileIfOrphaned,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  OrganizationUnsupportedMediaType,
  OrganizationError,
  OrganizationConflict,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const { cascadeDeleteSignatureFiles } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

const { ConversationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

async function updateOrganization(req, res, next) {
  try {
    if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

    let organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length === 0)
      throw new OrganizationError("Organization not found")
    organization = organization[0]

    if (req.body.token) organization.token = req.body.token
    if (req.body.description) organization.description = req.body.description
    if (req.body.name) organization.name = req.body.name

    const result = await model.organizations.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError()

    res.status(200).send({
      message: "Organization has been updated",
    })
  } catch (err) {
    next(err)
  }
}

async function deleteOrganization(req, res, next) {
  try {
    if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()

    let organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length === 0)
      throw new OrganizationError("Organization not found")
    organization = organization[0]

    let lconv = await model.conversations.getByOrga(req.params.organizationId)
    lconv.map(async (conv) => {
      const result = await model.conversations.delete(conv._id)
      if (result.deletedCount !== 1)
        throw new ConversationError(
          "Error while deleting conversation from organization",
        )

      if (conv?.metadata?.audio) {
        await deleteAudioFileIfOrphaned(conv.metadata.audio.filepath)
      }
    })
    //delete all subtitle from that organization
    await model.conversationSubtitles.deleteAllFromOrga(
      organization._id.toString(),
    )

    // Delete all voice signatures and their audio files
    const voiceSignatures = await model.voiceSignatures.getByOrganizationId(
      organization._id.toString(),
    )
    cascadeDeleteSignatureFiles(voiceSignatures)

    // Delete all voice signature records, speaker labels, and collections in parallel
    await Promise.all([
      model.voiceSignatures.deleteAllFromOrganization(
        organization._id.toString(),
      ),
      model.speakerLabels.deleteAllFromOrganization(
        organization._id.toString(),
      ),
      model.speakerLabelCollections.deleteAllFromOrganization(
        organization._id.toString(),
      ),
    ])

    const result = await model.organizations.delete(organization._id.toString())
    if (result.deletedCount !== 1)
      throw new OrganizationError("Error when deleting organization")

    res.status(200).send({
      message: "Organization has been deleted",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  updateOrganization,
  deleteOrganization,
}
