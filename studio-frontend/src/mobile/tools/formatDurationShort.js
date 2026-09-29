/**
 * Human duration for lists: "42 min", "1 h 12", "< 1 min".
 * @param {number} milliseconds
 * @returns {string}
 */
export function formatDurationShort(milliseconds) {
  const totalMinutes = Math.round(Math.max(0, milliseconds) / 60_000)
  if (totalMinutes < 1) return "< 1 min"
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes} min`
  return `${hours} h ${String(minutes).padStart(2, "0")}`
}
