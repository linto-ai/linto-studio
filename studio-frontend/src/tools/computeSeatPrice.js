/**
 * Per-seat price of the chosen billing period.
 * @param {object} pricing - plan catalog pricing ({ amountCents, amountCentsYearly? })
 * @param {string} billingPeriod - "monthly" | "annual"
 * @returns {{ amountCents: number, isAnnual: boolean }} isAnnual only when the
 * plan has a yearly price
 */
export function computeSeatPrice(pricing, billingPeriod) {
  const isAnnual = billingPeriod === "annual" && !!pricing?.amountCentsYearly
  return {
    amountCents: isAnnual
      ? pricing.amountCentsYearly
      : (pricing?.amountCents ?? 0),
    isAnnual,
  }
}
