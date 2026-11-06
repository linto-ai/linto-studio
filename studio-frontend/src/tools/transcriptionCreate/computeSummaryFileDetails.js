import { computeFileExtension } from "../computeFileExtension.js"
import { formatMediaDuration } from "./formatMediaDuration.js"

/**
 * The line of a file in the summary: "m4a · 48 min", or "m4a · 25 %" while it
 * is being sent. What isn't known (no extension, duration unread) is left out.
 * @param {File} file
 * @param {number|null} durationInSeconds
 * @param {number|null} percent - how much is sent, null when not being sent
 * @param {string} locale - e.g. "fr-FR"
 * @returns {string}
 */
export function computeSummaryFileDetails(
  file,
  durationInSeconds,
  percent,
  locale,
) {
  return [
    computeFileExtension(file.name),
    percent === null
      ? formatMediaDuration(durationInSeconds, locale)
      : formatPercent(percent, locale),
  ]
    .filter(Boolean)
    .join(" · ")
}

function formatPercent(percent, locale) {
  return new Intl.NumberFormat(locale, { style: "percent" }).format(
    percent / 100,
  )
}
