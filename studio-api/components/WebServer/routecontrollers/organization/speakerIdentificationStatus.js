const model = require(`${process.cwd()}/lib/mongodb/models`)
const connector = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/connector`,
)

/**
 * Organization-level speaker identification status (cf. docs/speaker-identification
 * 05 §4.4): whether the pipeline is reachable, the embedding model id, and how
 * many Qdrant operations are still pending reconciliation for the organization.
 */
async function getSpeakerIdentificationStatus(req, res, next) {
  try {
    const organizationId = req.params.organizationId

    const [info, syncPending] = await Promise.all([
      connector.getInfo(organizationId),
      model.speakerIdSyncOps.countByOrganization(organizationId),
    ])

    res.status(200).send({
      enabled: Boolean(info && info.enabled),
      modelId: (info && info.modelId) || null,
      dim: (info && info.dim) || null,
      syncPending,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSpeakerIdentificationStatus,
}
