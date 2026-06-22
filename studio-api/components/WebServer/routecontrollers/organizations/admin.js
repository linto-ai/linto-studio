const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organizations:admin",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
  deleteAudioFileIfOrphaned,
  cascadeDeleteSampleFiles,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const { OrganizationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const { ConversationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

const triggers = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
)

async function updateOrganization(req, res, next) {
  try {
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

    // Delete all voice samples and their audio files
    const voiceSamples = await model.voiceSamples.getByOrganizationId(
      organization._id.toString(),
    )
    cascadeDeleteSampleFiles(voiceSamples)

    // Drop every Qdrant collection of the organization and delete the label
    // voiceprints (reads collections/labels before the Mongo cascade below).
    const [orgCollections, orgLabels] = await Promise.all([
      model.voiceprintCollections.getByOrganizationId(
        organization._id.toString(),
      ),
      model.speakerLabels.getByOrganizationId(organization._id.toString()),
    ])
    await triggers.dropOrganizationSpeakers(
      organization._id.toString(),
      orgCollections,
      orgLabels,
    )

    // Delete all voice sample records, speaker labels, voiceprint collections,
    // opt-ins, and any pending reconciliation ops in parallel
    await Promise.all([
      model.voiceSamples.deleteAllFromOrganization(
        organization._id.toString(),
      ),
      model.speakerLabels.deleteAllFromOrganization(
        organization._id.toString(),
      ),
      model.voiceprintCollections.deleteAllFromOrganization(
        organization._id.toString(),
      ),
      model.voiceOptIns.deleteAllFromOrganization(
        organization._id.toString(),
      ),
      model.speakerIdSyncOps.deleteAllFromOrganization(
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
