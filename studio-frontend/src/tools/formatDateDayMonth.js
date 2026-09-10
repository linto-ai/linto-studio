/**
 * Formats a date string as a short "day month" label (e.g. "14 sept."),
 * with no year or time. Used for compact reset/renewal dates in usage UI.
 * @param {string} dateString - ISO date string
 * @param {string} locale - BCP-47 tag, e.g. this.$i18n.locale ("fr-FR")
 * @returns {string} formatted date, or "" for an empty/invalid input
 */
export function formatDateDayMonth(dateString, locale = "fr-FR") {
  if (!dateString) return ""
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date)
}
