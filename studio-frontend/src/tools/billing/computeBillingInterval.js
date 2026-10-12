const ANNUAL_PERIOD_DAYS = 300
const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Whether a subscription is billed monthly or yearly, read from the length of
 * its current period. The subscription row carries no interval of its own: the
 * period is the only clue available to the front.
 * @param {string|Date|null} periodStart
 * @param {string|Date|null} periodEnd
 * @returns {"monthly"|"annual"} monthly when the period is unknown
 */
export function computeBillingInterval(periodStart, periodEnd) {
  const start = Date.parse(periodStart)
  const end = Date.parse(periodEnd)
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return "monthly"
  return (end - start) / DAY_MS >= ANNUAL_PERIOD_DAYS ? "annual" : "monthly"
}
