// From this share of a quota or pack used, the bar warns
const WARNING_RATIO = 0.8

/**
 * How close a consumption is to its limit, as the status of its usage bar:
 * success, warning from 80 % used, danger once all of it is used.
 * @param {number} used - consumed amount
 * @param {number} max - the limit (a max of 0 or less counts as 1)
 * @returns {"success"|"warning"|"danger"}
 */
export function computeUsageStatus(used, max) {
  const ratio = (used || 0) / Math.max(1, max || 0)
  if (ratio >= 1) return "danger"
  if (ratio >= WARNING_RATIO) return "warning"
  return "success"
}
