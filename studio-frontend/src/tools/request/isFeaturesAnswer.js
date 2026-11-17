// The flags GET /features answers, all of them booleans (studio-api
// lib/features.js).
const FEATURE_KEYS = ["saas", "session", "speakerIdentification"]

/**
 * Whether a GET /features body is the API's feature list: a front or a
 * proxy answering in its place sends HTML, an older API a 404.
 * @param {unknown} data
 * @returns {boolean}
 */
export function isFeaturesAnswer(data) {
  return FEATURE_KEYS.every((key) => typeof data?.[key] === "boolean")
}
