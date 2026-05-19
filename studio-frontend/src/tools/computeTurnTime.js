/**
 * Computes the absolute start date of a turn (astart + start).
 *
 * @param {object} content - Turn object with .astart (ISO string) and .start (seconds)
 * @returns {number|undefined} Unix timestamp in seconds, or undefined if .astart is missing
 */
export function computeTurnStartDate(content) {
  if (!content.astart) return undefined
  return new Date(content.astart).getTime() / 1000 + content.start
}

/**
 * Computes the absolute end date of a turn (astart + end).
 *
 * @param {object} content - Turn object with .astart (ISO string) and .end (seconds)
 * @returns {number|undefined} Unix timestamp in seconds, or undefined if .astart is missing
 */
export function computeTurnEndDate(content) {
  if (!content.astart) return undefined
  return new Date(content.astart).getTime() / 1000 + content.end
}
