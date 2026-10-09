// An overdraft lot is a debt the next purchase pays back, not a pack
const HIDDEN_SOURCES = ["overdraft"]

// AI credits are no pack of their own: a transcription pack grants them in a
// second lot of the same payment, shown on the pack card.
const AI_KIND = "ai"

/**
 * The prepaid packs of an organization as the billing tab lists them: packs
 * still holding something first, in the order the API consumes them
 * (earliest expiry first), then the spent ones. The pack consumed next of
 * each kind the plan consumes is the current one. Expired lots, overdrafts
 * and AI credits (attached to the pack that bought them) are left out.
 * @param {Array} lots - `lots` of GET /cloud/credits/:orgId
 * @param {object} [options]
 * @param {Date} [options.now]
 * @param {string[]|null} [options.consumedKinds] - kinds of lots the plan
 *   consumes (see consumesLots of computeAvailableBalances), every kind when
 *   null
 * @returns {Array<{id: string, kind: string, source: string, minutes: number,
 *   remaining: number, consumed: number, expiresAt: string,
 *   isExhausted: boolean, isCurrent: boolean,
 *   aiCredits: {remaining: number, total: number}|null}>}
 */
export function computePackLots(
  lots,
  { now = new Date(), consumedKinds = null } = {},
) {
  if (!Array.isArray(lots)) return []
  const listedLots = lots.filter((lot) => isListedLot(lot, now))
  const aiLots = listedLots.filter((lot) => lot.kind === AI_KIND)
  const packs = listedLots
    .filter((lot) => lot.kind !== AI_KIND)
    .map((lot) => computePackLot(lot, findPaymentAiLot(lot, aiLots)))
    .sort(comparePackLots)
  return markCurrentPacks(packs, consumedKinds)
}

function isListedLot(lot, now) {
  if (HIDDEN_SOURCES.includes(lot.source)) return false
  return new Date(lot.expiresAt) > now
}

function computePackLot(lot, aiLot) {
  const { total: minutes, remaining } = computeLotAmounts(lot)
  const aiCredits = aiLot ? computeLotAmounts(aiLot) : null
  return {
    id: String(lot._id),
    kind: lot.kind || "live",
    source: lot.source,
    minutes,
    remaining,
    consumed: minutes - remaining,
    expiresAt: lot.expiresAt,
    // Its AI credits keep a pack in use once its minutes are spent
    isExhausted:
      isSpent(remaining) && (!aiCredits || isSpent(aiCredits.remaining)),
    isCurrent: false,
    aiCredits,
  }
}

// Less than half a minute left reads "0 min": nothing left to use
function isSpent(remaining) {
  return Math.round(remaining) === 0
}

function computeLotAmounts(lot) {
  const total = Math.max(0, lot.minutes || 0)
  const remaining = Math.min(total, Math.max(0, lot.remaining || 0))
  return { total, remaining }
}

// The AI lot granted by the same Stripe payment as this pack
function findPaymentAiLot(lot, aiLots) {
  const sessionId = lot.ref?.stripeCheckoutSessionId
  if (!sessionId) return null
  return (
    aiLots.find((aiLot) => aiLot.ref?.stripeCheckoutSessionId === sessionId) ||
    null
  )
}

function comparePackLots(a, b) {
  if (a.isExhausted !== b.isExhausted) return a.isExhausted ? 1 : -1
  return new Date(a.expiresAt) - new Date(b.expiresAt)
}

// The packs come in consumption order: the first one of each kind still
// holding something is the one being consumed, when the plan consumes the
// kind at all (a file pack bought on Free sits unused on Premium)
function markCurrentPacks(packs, consumedKinds) {
  const currentKinds = new Set()
  return packs.map((pack) => {
    if (pack.isExhausted || currentKinds.has(pack.kind)) return pack
    if (consumedKinds && !consumedKinds.includes(pack.kind)) return pack
    currentKinds.add(pack.kind)
    return { ...pack, isCurrent: true }
  })
}
