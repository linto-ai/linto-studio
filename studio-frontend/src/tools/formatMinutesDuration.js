/**
 * Formats a minutes count into a compact "1 h 30 min" style string, dropping
 * the part that's zero (e.g. "1 h" or "30 min"). Used to display usage
 * meters expressed in minutes (import quota, live balance) as hours/minutes.
 * @param {number} minutes - the duration in minutes
 * @returns {string} formatted duration, e.g. "0 min", "1 h", "1 h 30 min",
 * "-30 min"
 */
export function formatMinutesDuration(minutes) {
  const total = Math.round(minutes || 0)
  // A balance can go negative (an overdraft lot), and the sign belongs in front
  // of the whole duration — not spread over each part.
  const sign = total < 0 ? "-" : ""
  const absolute = Math.abs(total)
  const hours = Math.floor(absolute / 60)
  const remainingMinutes = absolute % 60

  if (hours === 0) {
    return `${sign}${remainingMinutes} min`
  }
  if (remainingMinutes === 0) {
    return `${sign}${hours} h`
  }
  return `${sign}${hours} h ${remainingMinutes} min`
}
