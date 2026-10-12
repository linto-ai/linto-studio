import { isQuotaUnlimited } from "./billingMeters.js"

// What the billing tab adds up, in display order: the quota the plan grants
// (none for live, prepaid only) and the kind of lots that top it up.
const BALANCES = [
  {
    key: "transcription",
    capability: "import.minutes",
    lotKind: "transcription",
    unit: "minutes",
  },
  { key: "live", capability: null, lotKind: "live", unit: "minutes" },
  { key: "ai", capability: "ai.credits", lotKind: "ai", unit: "credits" },
]

// Units nobody paid for: the welcome lot of a plan, a manual grant from the
// backoffice. An overdraft lot is a debt, never something available.
const OFFERED_SOURCES = ["welcome", "manual"]
const PURCHASED_SOURCE = "stripe"

/**
 * What an organization can still use, per kind of usage: the plan quota
 * (consumed first), then the lots, bought and offered apart, each source
 * dated by its earliest expiry (the API consumes lots earliest first). A debt (an overdraft on a lot) is taken off what the lots hold,
 * as the API balance does. Pure: no i18n and no formatting.
 * @param {object} params
 * @param {object|null} params.usage - GET /cloud/usage/:orgId
 * @param {Array} params.lots - `lots` of GET /cloud/credits/:orgId
 * @param {Date} [params.now]
 * @returns {Array<{key: string, unit: "minutes"|"credits", lotKind: string,
 *   consumesLots: boolean, isUnlimited: boolean, available: number|null,
 *   used: number|null, resetAt: string|null, costs: object|null,
 *   sources: Array<{type: "plan"|"packs"|"offered", remaining: number,
 *   total: number, count?: number, resetAt?: string|null,
 *   expiresAt?: string}>}>}
 */
export function computeAvailableBalances({ usage, lots, now = new Date() }) {
  const unexpiredLots = computeUnexpiredLots(lots, now)
  const isUnmetered = !!usage?.mode && usage.mode !== "normal"
  return BALANCES.map((balance) =>
    computeBalance(balance, usage, unexpiredLots, isUnmetered),
  )
}

function computeBalance(balance, usage, unexpiredLots, isUnmetered) {
  const quota = balance.capability
    ? usage?.capabilities?.[balance.capability] || null
    : null
  const costs = quota?.costs || null
  // comp and managed orgs have no limit; a quota too large to mean anything
  // (Business) reads the same
  if (isUnmetered || isUnlimitedQuota(quota)) {
    return computeUnlimitedBalance(balance, quota, costs)
  }
  const consumesLots = isConsumingLots(balance, quota)
  const kindLots = consumesLots
    ? unexpiredLots.filter((lot) => lot.kind === balance.lotKind)
    : []
  const sources = [
    computePlanSource(quota),
    ...computeLotSources(kindLots),
  ].filter(Boolean)
  return {
    key: balance.key,
    unit: balance.unit,
    lotKind: balance.lotKind,
    consumesLots,
    isUnlimited: false,
    available: sumRemaining(sources),
    used: null,
    resetAt: null,
    costs,
    sources,
  }
}

// Nothing to count down: what was used this period goes with the plan
// line instead. Live has no quota, so nothing used to tell.
function computeUnlimitedBalance(balance, quota, costs) {
  const isQuota = quota?.type === "quota"
  return {
    key: balance.key,
    unit: balance.unit,
    lotKind: balance.lotKind,
    consumesLots: false,
    isUnlimited: true,
    available: null,
    used: isQuota ? quota.used || 0 : null,
    resetAt: (isQuota && quota.resetAt) || null,
    costs,
    sources: [],
  }
}

function isUnlimitedQuota(quota) {
  return quota?.type === "quota" && isQuotaUnlimited(quota.limit, quota.unit)
}

function computePlanSource(quota) {
  if (quota?.type !== "quota") return null
  return {
    type: "plan",
    remaining: Math.max(0, quota.remaining ?? quota.limit - quota.used),
    total: quota.limit,
    resetAt: quota.resetAt || null,
  }
}

// Lots of a quota only count when the plan tops the quota up with them: the
// API leaves them untouched otherwise. Live has no quota, its lots always
// count.
function isConsumingLots(balance, quota) {
  return !balance.capability || !!quota?.topUp
}

function computeLotSources(kindLots) {
  const openLots = kindLots.filter((lot) => lot.remaining > 0)
  const sources = [
    computeLotSource(
      "packs",
      openLots.filter((lot) => lot.source === PURCHASED_SOURCE),
    ),
    computeLotSource(
      "offered",
      openLots.filter((lot) => OFFERED_SOURCES.includes(lot.source)),
    ),
  ].filter(Boolean)
  return settleDebt(sources, computeDebt(kindLots))
}

// An overdraft sits on a lot as a negative remaining (or on an overdraft
// lot of its own)
function computeDebt(kindLots) {
  return kindLots.reduce((debt, lot) => debt + Math.max(0, -lot.remaining), 0)
}

// Takes the debt off the sources in reading order, never below zero
function settleDebt(sources, debt) {
  return sources.reduce(
    (state, source) => {
      const paid = Math.min(source.remaining, state.debt)
      return {
        settled: [
          ...state.settled,
          { ...source, remaining: source.remaining - paid },
        ],
        debt: state.debt - paid,
      }
    },
    { settled: [], debt },
  ).settled
}

function computeLotSource(type, lots) {
  if (!lots.length) return null
  return {
    type,
    count: lots.length,
    remaining: lots.reduce((sum, lot) => sum + lot.remaining, 0),
    total: lots.reduce((sum, lot) => sum + lot.minutes, 0),
    // The lots come earliest expiry first
    expiresAt: lots[0].expiresAt,
  }
}

// Lots not expired yet, debts included, earliest expiry first
function computeUnexpiredLots(lots, now) {
  if (!Array.isArray(lots)) return []
  return lots
    .filter((lot) => new Date(lot.expiresAt) > now)
    .map((lot) => ({
      ...lot,
      kind: lot.kind || "live",
      remaining: lot.remaining || 0,
      minutes: Math.max(lot.minutes || 0, lot.remaining || 0),
    }))
    .sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt))
}

function sumRemaining(sources) {
  return sources.reduce((sum, source) => sum + source.remaining, 0)
}
