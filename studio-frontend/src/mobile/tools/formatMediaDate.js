/**
 * Short date of a media for lists: "14 sept." this year, "14 sept. 2025"
 * otherwise. Empty string for a missing or invalid date.
 * @param {string|number|Date} value
 * @param {string} locale
 * @param {Date} now
 * @returns {string}
 */
export function formatMediaDate(value, locale, now = new Date()) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const sameYear = date.getFullYear() === now.getFullYear()
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
  }).format(date)
}
