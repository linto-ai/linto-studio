const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)

// `recording` is left out: LinTO is never called for it
const LINTO_FEATURES = [
  "transcription.live",
  "transcription.async",
  "summary",
  "translation",
]

const PERMISSION_FEATURES = Object.freeze({
  [PERMISSIONS.UPLOAD]: "transcription.async",
  [PERMISSIONS.SUMMARY]: "summary",
  [PERMISSIONS.MICROPHONE]: "transcription.live",
  [PERMISSIONS.BOT]: "transcription.live",
  [PERMISSIONS.SESSION]: "transcription.live",
})

function isObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value)
}

function parseFeatures(raw, path = "features") {
  if (!isObject(raw)) throw new Error(`${path} must be an object`)
  const clean = {}
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "boolean") clean[key] = value
    else if (isObject(value))
      clean[key] = parseFeatures(value, `${path}.${key}`)
    else throw new Error(`${path}.${key} must be a boolean or an object`)
  }
  return clean
}

function hasFeature(features, path) {
  let node = features
  for (const part of path.split(".")) {
    if (!node || typeof node !== "object") return false
    node = node[part]
  }
  return node === true
}

function hasActiveFeature(features) {
  if (!isObject(features)) return false
  return Object.values(features).some(
    (value) => value === true || (isObject(value) && hasActiveFeature(value)),
  )
}

function hasLintoFeature(features) {
  return LINTO_FEATURES.some((path) => hasFeature(features, path))
}

// `features` is null for a caller that stands for no external identity
function canQuickMeeting(caller, features) {
  if (caller?.type === USER_TYPE.M2M && caller.metadata?.quickMeeting === false)
    return false
  return !features || hasFeature(features, "transcription.live")
}

function capabilitiesFrom(features, caller) {
  const transcription = features.transcription || {}
  return {
    ...features,
    quickMeeting: canQuickMeeting(caller, features),
    transcription: {
      ...transcription,
      live: transcription.live === true,
      async: transcription.async === true,
    },
  }
}

module.exports = {
  PERMISSION_FEATURES,
  parseFeatures,
  hasFeature,
  hasActiveFeature,
  hasLintoFeature,
  canQuickMeeting,
  capabilitiesFrom,
}
