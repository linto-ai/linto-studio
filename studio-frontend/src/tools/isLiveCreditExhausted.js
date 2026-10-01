/**
 * Whether the org's prepaid live minutes are used up, so a live transcription
 * would be refused (credit_exhausted). Unknown (usage not loaded, OSS build)
 * or unmetered is never exhausted: the server stays the judge.
 * @param {object|null} live - live block of GET /cloud/usage/:orgId
 * @returns {boolean}
 */
export function isLiveCreditExhausted(live) {
  if (!live || live.unmetered === true) return false
  return (live.balance || 0) <= 0
}
