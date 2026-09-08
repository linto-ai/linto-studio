/**
 * Formats a minutes count into a compact "1 h 30 min" style string, dropping
 * the part that's zero (e.g. "1 h" or "30 min"). Used to display usage
 * meters expressed in minutes (import quota, live balance) as hours/minutes.
 * @param {number} minutes - the duration in minutes
 * @returns {string} formatted duration, e.g. "0 min", "1 h", "1 h 30 min"
 */
export function formatMinutesDuration(minutes) {
  const total = Math.round(minutes || 0)
  const hours = Math.floor(total / 60)
  const remainingMinutes = total % 60

  if (hours === 0) {
    return `${remainingMinutes} min`
  }
  if (remainingMinutes === 0) {
    return `${hours} h`
  }
  return `${hours} h ${remainingMinutes} min`
}
