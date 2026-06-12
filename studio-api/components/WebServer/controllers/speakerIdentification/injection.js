/**
 * Server-side injection of the speaker identification configuration into a
 * transcription request (cf. docs/speaker-identification 03 D6, 07 §3).
 *
 * The client only sends a list of Studio collection ids
 * (`speakerIdentificationCollections`). studio-api validates ownership and
 * builds the `diarizationConfig.speakerIdentificationConfig` itself; any
 * client-supplied speakerIdentificationConfig is discarded. Qdrant collection
 * names are never trusted from the client.
 */

const model = require(`${process.cwd()}/lib/mongodb/models`)
const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)
const { ConversationError, SpeakerIdentificationForbidden } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

function parseConfig(transcriptionConfig) {
  if (transcriptionConfig === undefined || transcriptionConfig === null) {
    return {}
  }
  if (typeof transcriptionConfig === "object") {
    return transcriptionConfig
  }
  if (transcriptionConfig === "") {
    return {}
  }
  try {
    return JSON.parse(transcriptionConfig)
  } catch (err) {
    // Reject malformed config rather than silently dropping it: the client
    // config is overwritten downstream, so a silent {} would discard the
    // whole request config without any feedback.
    throw new ConversationError("transcriptionConfig is not valid JSON")
  }
}

function parseCollectionIds(raw) {
  if (raw === undefined || raw === null || raw === "") return []
  let ids = raw
  if (typeof raw === "string") {
    try {
      ids = JSON.parse(raw)
    } catch (err) {
      // allow a single id or comma-separated list as a fallback
      ids = raw.split(",").map((s) => s.trim()).filter(Boolean)
    }
  }
  if (!Array.isArray(ids)) {
    throw new ConversationError(
      "speakerIdentificationCollections must be a JSON array of collection ids",
    )
  }
  return ids.map((id) => String(id))
}

/**
 * Validate the requested collections and build the speaker identification
 * configuration. Mutates and returns the transcriptionConfig object, and the
 * security headers to attach to the gateway call.
 *
 * @returns {Promise<{transcriptionConfig: object, headers: object, enabled: boolean}>}
 */
async function applySpeakerIdentification(body, organization) {
  const transcriptionConfig = parseConfig(body.transcriptionConfig)

  // Always discard any client-supplied speakerIdentificationConfig (D6)
  if (transcriptionConfig.diarizationConfig) {
    delete transcriptionConfig.diarizationConfig.speakerIdentificationConfig
  }

  const collectionIds = parseCollectionIds(body.speakerIdentificationCollections)
  if (collectionIds.length === 0) {
    return { transcriptionConfig, headers: {}, enabled: false }
  }

  if (process.env.ENABLE_SPEAKER_IDENTIFICATION !== "true") {
    throw new ConversationError("Speaker identification is not enabled")
  }

  if (
    !PERMISSIONS.hasRightAccess(
      organization.permissions,
      PERMISSIONS.SPEAKER_IDENTIFICATION,
    )
  ) {
    throw new ConversationError(
      "Organization does not have the speaker identification permission",
    )
  }

  const diarizationConfig = transcriptionConfig.diarizationConfig
  if (!diarizationConfig || diarizationConfig.enableDiarization !== true) {
    throw new ConversationError(
      "Speaker identification requires diarization to be enabled",
    )
  }

  const organizationId = organization._id.toString()
  const qdrantCollections = []
  for (const collectionId of collectionIds) {
    const found = await model.voiceprintCollections.getById(collectionId)
    if (
      !found ||
      found.length === 0 ||
      found[0].organizationId.toString() !== organizationId
    ) {
      throw new SpeakerIdentificationForbidden()
    }
    qdrantCollections.push(found[0].qdrantCollectionName)
  }

  diarizationConfig.speakerIdentificationConfig = {
    organizationId,
    collections: qdrantCollections,
    speakers: "*",
    minSimilarity: null,
  }

  const headers = { "X-Organization-Id": organizationId }
  if (process.env.SPEAKER_ID_API_TOKEN) {
    headers["X-Speaker-Id-Token"] = process.env.SPEAKER_ID_API_TOKEN
  }

  return { transcriptionConfig, headers, enabled: true }
}

module.exports = {
  applySpeakerIdentification,
  parseCollectionIds,
}
