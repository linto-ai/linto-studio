import { computeValidityDuration } from "./computeValidityDuration.js"

/**
 * The validity some packs share, as a buyer reads it ("12 months"), or null
 * when they do not share one or have none.
 * @param {Array<{validityDays?: number}>} packs - from GET /cloud/packs
 * @param {string} locale - e.g. "fr-FR"
 * @returns {string|null}
 */
export function formatPackValidity(packs, locale) {
  if (!Array.isArray(packs)) return null
  const validityDays = [...new Set(packs.map((pack) => pack.validityDays))]
  if (validityDays.length !== 1) return null
  const duration = computeValidityDuration(validityDays[0])
  if (!duration) return null
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: duration.unit,
    unitDisplay: "long",
  }).format(duration.value)
}
