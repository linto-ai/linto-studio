// A new sample must match the speaker voiceprint (same person and conditions)

const debug = require("debug")(
  "linto:components:WebServer:controllers:speakerIdentification:homogeneity",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const connector = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/connector`,
)
const triggers = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
)
const limits = require(`${process.cwd()}/lib/dao/speakerIdentification/limits`)
const { cosineSimilarity } = require(
  `${process.cwd()}/lib/dao/speakerIdentification/similarity`,
)
const { SPEAKER_TYPE } = require(
  `${process.cwd()}/lib/dao/speakerIdentification/naming`,
)
const {
  VoiceSampleUnprocessable,
  VoiceSampleMismatch,
  SpeakerIdentificationUnavailable,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerIdentification`,
)

// No answer from the service refuses the upload: nothing unchecked is stored
async function computeSampleVoiceprint(organizationId, absolutePath) {
  try {
    return await connector.computeVoiceprint(organizationId, [absolutePath])
  } catch (err) {
    debug("voiceprint compute failed for %s: %s", absolutePath, err.message)
    if (err.response) throw new VoiceSampleUnprocessable()
    throw new SpeakerIdentificationUnavailable()
  }
}

// Throws VoiceSampleMismatch (422), VoiceSampleUnprocessable (400) or
// SpeakerIdentificationUnavailable (503); a first sample has no reference
async function checkSampleHomogeneity({
  organizationId,
  subjectType,
  subjectId,
  absolutePath,
}) {
  if (!triggers.enabled()) return
  const threshold = limits.minSampleSimilarity()
  if (!threshold) return

  let computeOrgId = organizationId
  if (!computeOrgId && subjectType === SPEAKER_TYPE.USER) {
    computeOrgId = await triggers.resolveUserComputeOrgId(subjectId)
  }
  if (!computeOrgId) return

  const result = await computeSampleVoiceprint(computeOrgId, absolutePath)

  const reference = await model.voiceprints.getBySubject(subjectType, subjectId)
  if (!model.voiceprints.hasComputedVoiceprint(reference)) return
  if (reference.modelId && result.modelId !== reference.modelId) return

  const similarity = cosineSimilarity(result.vector, reference.vector)
  if (similarity === null) return
  if (similarity < threshold) {
    throw new VoiceSampleMismatch(
      `Voice sample not kept: this voice signature would not be reliable, the recording environment seems different from the previous samples (similarity ${similarity.toFixed(2)}, minimum ${threshold}). Record again in a quiet place, close to the microphone, in the same conditions as the first samples`,
      { similarity, threshold },
    )
  }
}

module.exports = { checkSampleHomogeneity }
