// A minutes quota above this is unlimited in practice: shown as "unlimited"
// rather than as a literal (and meaningless) hour count.
export const UNLIMITED_MINUTES_THRESHOLD = 100 * 60

export function isQuotaUnlimited(limit, unit) {
  if (limit === null || limit === undefined) return true
  return unit === "minutes" && limit > UNLIMITED_MINUTES_THRESHOLD
}

/**
 * Turns a raw usage.capabilities object (GET /cloud/usage/:orgId) into
 * display-ready quota meters. Pure transform: no i18n, no number formatting —
 * callers own labels and how used/limit are displayed.
 * @param {object} capabilities - usage.capabilities from apiGetUsage
 * @returns {Array<{key: string, used: number, limit: number|null, unit: string, resetAt: string|null, unlimited: boolean}>}
 */
export function computeQuotaMeters(capabilities) {
  if (!capabilities) return []
  return Object.entries(capabilities)
    .filter(([, c]) => c && c.type === "quota")
    .map(([key, c]) => ({
      key,
      used: c.used,
      limit: c.limit,
      unit: c.unit, // "minutes" | "count"
      resetAt: c.resetAt || null,
      unlimited: isQuotaUnlimited(c.limit, c.unit),
    }))
}
