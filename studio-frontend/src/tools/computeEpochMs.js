/**
 * Converts a server timestamp to epoch milliseconds. The API sends
 * `last_update` as an ISO string (moment().format()), while the SDK compares
 * plain numbers.
 * @param {string | number | Date | null | undefined} value
 * @returns {number | null} epoch ms, or null when missing or invalid
 */
export function computeEpochMs(value) {
  if (value == null || typeof value === "boolean") return null
  const ms = new Date(value).getTime()
  return Number.isFinite(ms) ? ms : null
}
