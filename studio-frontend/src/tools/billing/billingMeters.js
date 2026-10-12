// A quota above these is unlimited in practice (Business, fair use): shown
// as "unlimited" rather than as a literal (and meaningless) count.
export const UNLIMITED_MINUTES_THRESHOLD = 100 * 60
export const UNLIMITED_CREDITS_THRESHOLD = 1000

export function isQuotaUnlimited(limit, unit) {
  if (limit === null || limit === undefined) return true
  if (unit === "minutes") return limit > UNLIMITED_MINUTES_THRESHOLD
  if (unit === "credits") return limit > UNLIMITED_CREDITS_THRESHOLD
  return false
}
