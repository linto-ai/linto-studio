import { isLiveCreditExhausted } from "./isLiveCreditExhausted.js"

/**
 * How worried a running live should be about the org's prepaid live minutes.
 * "exhausted": the balance is used up, the server cuts the live once the
 * tolerated overdraft is reached. "low": the server's low-balance threshold is
 * crossed. Unknown (usage not loaded, OSS build) or unmetered is never a
 * concern: the server stays the judge.
 * @param {object|null} live - live block of GET /cloud/usage/:orgId
 * @returns {"exhausted"|"low"|null}
 */
export function computeLiveCreditLevel(live) {
  if (!live || live.unmetered === true) return null
  if (isLiveCreditExhausted(live)) return "exhausted"
  if (live.lowBalance === true) return "low"
  return null
}
