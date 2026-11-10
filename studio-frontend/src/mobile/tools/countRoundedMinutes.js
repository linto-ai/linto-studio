/**
 * Whole minutes of a duration, rounded the way formatDurationShort shows
 * them: picks the singular or plural form of a text quoting that duration.
 * @param {number} milliseconds
 * @returns {number}
 */
export function countRoundedMinutes(milliseconds) {
  return Math.round(Math.max(0, milliseconds) / 60_000)
}
