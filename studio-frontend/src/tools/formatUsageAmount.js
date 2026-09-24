import { formatMinutesDuration } from "./formatMinutesDuration.js"

/**
 * Renders a consumption counter for a usage column: a duration for a quota
 * metered in minutes, a plain count otherwise.
 * @param {number} value
 * @param {string} unit - "minutes" or "count"
 * @returns {string}
 */
export function formatUsageAmount(value, unit) {
  const amount = value || 0
  if (unit === "minutes") return formatMinutesDuration(amount)
  return String(Math.round(amount))
}
