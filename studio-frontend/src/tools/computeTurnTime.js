/**
 * Computes the absolute start time of a turn relative to session start.
 *
 * @param {object} content - Turn object with .astart (ISO string), .start (number)
 * @param {number} sessionStartMs - Session start time in epoch milliseconds
 * @returns {number} Start time in seconds relative to session start
 */
export function computeTurnStartTime(content, sessionStartMs) {
  if (!content.astart) return content.start
  return Math.max(
    0,
    (new Date(content.astart).getTime() - sessionStartMs) / 1000 +
      content.start,
  )
}

/**
 * Computes the absolute end time of a turn relative to session start.
 *
 * @param {object} content - Turn object with .astart (ISO string), .end (number)
 * @param {number} sessionStartMs - Session start time in epoch milliseconds
 * @returns {number} End time in seconds relative to session start
 */
export function computeTurnEndTime(content, sessionStartMs) {
  if (!content.astart) return content.end
  return Math.max(
    0,
    (new Date(content.astart).getTime() - sessionStartMs) / 1000 +
      content.end,
  )
}
