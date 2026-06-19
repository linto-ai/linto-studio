/**
 * Quantitative limits for speaker identification, configurable by env
 * (cf. docs/speaker-identification 05 §5).
 */

const DEFAULTS = Object.freeze({
  SPEAKER_ID_MAX_COLLECTIONS_PER_ORG: 20,
  SPEAKER_ID_MAX_LABELS_PER_COLLECTION: 100,
  SPEAKER_ID_MAX_SAMPLES_PER_LABEL: 10,
  SPEAKER_ID_MAX_TOTAL_DURATION_PER_LABEL: 600, // seconds
})

function readEnvInt(name) {
  const value = parseInt(process.env[name], 10)
  return !isNaN(value) && value > 0 ? value : DEFAULTS[name]
}

module.exports = {
  maxCollectionsPerOrg: () => readEnvInt("SPEAKER_ID_MAX_COLLECTIONS_PER_ORG"),
  maxLabelsPerCollection: () =>
    readEnvInt("SPEAKER_ID_MAX_LABELS_PER_COLLECTION"),
  maxSamplesPerLabel: () => readEnvInt("SPEAKER_ID_MAX_SAMPLES_PER_LABEL"),
  maxTotalDurationPerLabel: () =>
    readEnvInt("SPEAKER_ID_MAX_TOTAL_DURATION_PER_LABEL"),
}
