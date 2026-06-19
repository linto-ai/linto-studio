/**
 * Single source of truth for speaker identification naming conventions.
 * Qdrant collection names and speaker references are generated here and
 * nowhere else (cf. docs/speaker-identification 04 §4).
 */

const SPEAKER_TYPE = Object.freeze({
  USER: "user",
  LABEL: "label",
})

const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/
const QDRANT_COLLECTION_REGEX = /^spkid_[0-9a-f]{24}_[0-9a-f]{24}$/
const SPEAKER_REF_REGEX = /^(label|user):[0-9a-f]{24}$/

/**
 * Qdrant collection name for a studio voiceprint collection.
 * Frozen at collection creation time, never recomputed afterwards.
 * @param {string|object} organizationId
 * @param {string|object} collectionId
 * @returns {string} "spkid_{orgId}_{collectionId}"
 */
function qdrantCollectionName(organizationId, collectionId) {
  return `spkid_${organizationId.toString()}_${collectionId.toString()}`
}

/**
 * Stable speaker reference sent to the worker ("label:{id}" or "user:{id}").
 * The worker derives the Qdrant point UUID from this reference.
 * @param {string} type - "label" or "user"
 * @param {string|object} id
 * @returns {string}
 */
function speakerRef(type, id) {
  if (!Object.values(SPEAKER_TYPE).includes(type)) {
    throw new Error(`Invalid speaker reference type: ${type}`)
  }
  return `${type}:${id.toString()}`
}

/**
 * Display name of a user, as used across Studio:
 * concatenated firstname/lastname, falling back to email.
 * @param {object} user - user document
 * @returns {string}
 */
function displayName(user) {
  if (!user) return ""
  return (
    [user.firstname, user.lastname].filter(Boolean).join(" ").trim() ||
    user.email ||
    ""
  )
}

/**
 * Escape a string for safe inclusion in a regular expression
 * (used for case-insensitive name uniqueness lookups).
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

module.exports = {
  SPEAKER_TYPE,
  OBJECT_ID_REGEX,
  QDRANT_COLLECTION_REGEX,
  SPEAKER_REF_REGEX,
  qdrantCollectionName,
  speakerRef,
  displayName,
  escapeRegex,
}
