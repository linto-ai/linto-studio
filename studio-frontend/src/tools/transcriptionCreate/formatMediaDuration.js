import { computeDurationParts } from "../computeDurationParts.js"

/**
 * A media duration: seconds under a minute, otherwise hours and minutes.
 * @param {number|null} durationInSeconds - null when unknown
 * @param {string} locale - e.g. "fr-FR"
 * @returns {string|null} null when the duration is unknown
 */
export function formatMediaDuration(durationInSeconds, locale) {
  if (durationInSeconds === null || durationInSeconds === undefined) return null
  const seconds = Math.round(durationInSeconds)
  if (seconds < 60) {
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "second",
    }).format(seconds)
  }
  return computeDurationParts(seconds / 60, locale)
    .map((part) => part.value)
    .join(" ")
}
