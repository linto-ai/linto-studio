/**
 * Derives the annual pricing display data from a plan's monthly and yearly
 * prices, in cents. amountCentsYearly is the TOTAL charged once a year (not a
 * monthly equivalent) — see Plan.pricing in linto-studio-cloud-service.
 * @param {number} amountCentsMonthly
 * @param {number} amountCentsYearly - 0/null means no annual option
 * @returns {{ monthlyEquivalentCents: number, freeMonths: number } | null}
 */
export function computeAnnualPriceInfo(amountCentsMonthly, amountCentsYearly) {
  if (!amountCentsMonthly || !amountCentsYearly) {
    return null
  }
  const monthlyEquivalentCents = Math.round(amountCentsYearly / 12)
  const freeMonths = Math.round(
    (amountCentsMonthly * 12 - amountCentsYearly) / amountCentsMonthly,
  )
  return { monthlyEquivalentCents, freeMonths }
}
