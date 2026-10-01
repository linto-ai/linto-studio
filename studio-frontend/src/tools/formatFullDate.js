/**
 * Formats a date string as a full "day month year" label (e.g. "28 octobre
 * 2026"), with no time. Used for billing dates (renewal, invoices).
 * @param {string} dateString - ISO date string
 * @param {string} locale - BCP-47 tag, e.g. this.$i18n.locale ("fr-FR")
 * @returns {string} formatted date, or "" for an empty/invalid input
 */
export function formatFullDate(dateString, locale = "fr-FR") {
  if (!dateString) return ""
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}
