/**
 * Converts a quota entitlement limit to its monthly-equivalent count, so a
 * weekly-reset quota (e.g. the Free plan) can be displayed alongside
 * monthly-reset quotas with the same "per month" wording. The underlying
 * counter still resets weekly server-side; only the display is normalized.
 * @param {number} limit - the raw quota limit
 * @param {string} period - the entitlement rule's period ("weekly" | "monthly")
 * @returns {number} the limit expressed per calendar month
 */
export function computeQuotaMonthlyEquivalent(limit, period) {
  if (limit == null || isNaN(limit)) {
    return 0
  }
  if (period === "weekly") {
    return limit * 4
  }
  return limit
}
