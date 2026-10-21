/**
 * Whether the org's prepaid live minutes are too few to start a live: the
 * server admits one only with admissionMinutes of balance per language (a
 * running live goes on down to zero, see isLiveCreditExhausted). Unknown
 * (usage not loaded, OSS build) or unmetered is never too few: the server
 * stays the judge.
 * @param {object|null} live - live block of GET /cloud/usage/:orgId
 * @param {number} [languageCount] - languages of the live, translations
 *   included
 * @returns {boolean}
 */
export function isLiveCreditBelowAdmission(live, languageCount = 1) {
  if (!live || live.unmetered === true) return false
  const required = (live.admissionMinutes || 0) * languageCount
  const balance = live.balance || 0
  return required > 0 ? balance < required : balance <= 0
}
