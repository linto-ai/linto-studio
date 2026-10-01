const AVERAGE_DAYS_PER_MONTH = 365.25 / 12

/**
 * A validity given in days, as the duration a buyer reads: whole months from
 * four weeks on (365 days -> 12 months), days below. Meant for
 * Intl.NumberFormat's unit style.
 * @param {number} days
 * @returns {{ value: number, unit: "month" | "day" } | null} null without a positive duration
 */
export function computeValidityDuration(days) {
  if (!Number.isFinite(days) || days <= 0) return null
  if (days < 28) return { value: Math.round(days), unit: "day" }
  return { value: Math.round(days / AVERAGE_DAYS_PER_MONTH), unit: "month" }
}
