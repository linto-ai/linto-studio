/**
 * Formats a date string as a compact numeric date (e.g. "12/03/2027" in
 * French), with no time. Used where space is tight (pack cards).
 * @param {string} dateString - ISO date string
 * @param {string} locale - BCP-47 tag, e.g. this.$i18n.locale ("fr-FR")
 * @returns {string} formatted date, or "" for an empty/invalid input
 */
export function formatShortDate(dateString, locale = "fr-FR") {
  if (!dateString) return ""
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}
