import { computeFileExtension } from "../computeFileExtension.js"
import { formatFileSize } from "../formatFileSize.js"
import { formatMediaDuration } from "./formatMediaDuration.js"

/**
 * The line describing a picked file: "mp3 · 3 Mo · 48 min". What isn't known
 * (no extension, duration unread) is left out.
 * @param {File} file
 * @param {number|null} durationInSeconds
 * @param {string} locale - e.g. "fr-FR"
 * @returns {string}
 */
export function computeFileDetails(file, durationInSeconds, locale) {
  return [
    computeFileExtension(file.name),
    formatFileSize(file.size, locale),
    formatMediaDuration(durationInSeconds, locale),
  ]
    .filter(Boolean)
    .join(" · ")
}
