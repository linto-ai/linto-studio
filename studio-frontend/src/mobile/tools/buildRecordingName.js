/**
 * Default name of a recording: "Enregistrement 14 sept. 2026 10:32".
 * @param {Date} date
 * @param {string} locale - BCP 47 tag, e.g. "fr-FR"
 * @param {string} prefix - localized word for "Recording"
 * @returns {string}
 */
export function buildRecordingName(date, locale, prefix) {
  const day = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
  return `${prefix} ${day} ${time}`
}
