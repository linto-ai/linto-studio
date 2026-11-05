const UNITS = ["byte", "kilobyte", "megabyte", "gigabyte"]

/**
 * Human readable file size in the units of the locale ("3 Mo", "3 MB").
 * Only gigabytes keep a decimal: there, it is a third of the value.
 * @param {number} bytes
 * @param {string} locale - e.g. "fr-FR"
 * @returns {string}
 */
export function formatFileSize(bytes, locale) {
  const scale = Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024))
  const unitIndex = Math.min(scale, UNITS.length - 1)
  const unit = UNITS[unitIndex]
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    maximumFractionDigits: unit === "gigabyte" ? 1 : 0,
  }).format(bytes / 1024 ** unitIndex)
}
