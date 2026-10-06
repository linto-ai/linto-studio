// An overdraft lot is a debt the next purchase pays back, not a pack
const HIDDEN_SOURCES = ["overdraft"]

/**
 * The prepaid packs of an organization as the billing tab lists them: packs
 * still holding minutes first, in the order the API consumes them (earliest
 * expiry first), then the spent ones. Expired lots and overdrafts are left
 * out.
 * @param {Array} lots - `lots` of GET /cloud/credits/:orgId
 * @param {Date} [now]
 * @returns {Array<{id: string, kind: string, source: string, minutes: number,
 *   remaining: number, consumed: number, expiresAt: string,
 *   isExhausted: boolean}>}
 */
export function computePackLots(lots, now = new Date()) {
  if (!Array.isArray(lots)) return []
  return lots
    .filter((lot) => isListedLot(lot, now))
    .map(computePackLot)
    .sort(comparePackLots)
}

function isListedLot(lot, now) {
  if (HIDDEN_SOURCES.includes(lot.source)) return false
  return new Date(lot.expiresAt) > now
}

function computePackLot(lot) {
  const minutes = Math.max(0, lot.minutes || 0)
  const remaining = Math.min(minutes, Math.max(0, lot.remaining || 0))
  return {
    id: String(lot._id),
    kind: lot.kind || "live",
    source: lot.source,
    minutes,
    remaining,
    consumed: minutes - remaining,
    expiresAt: lot.expiresAt,
    isExhausted: remaining === 0,
  }
}

function comparePackLots(a, b) {
  if (a.isExhausted !== b.isExhausted) return a.isExhausted ? 1 : -1
  return new Date(a.expiresAt) - new Date(b.expiresAt)
}
