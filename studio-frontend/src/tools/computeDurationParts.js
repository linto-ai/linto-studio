/**
 * Splits a minutes count into localized number and unit parts, so a duration
 * can be typeset with big digits and small units ("12 h 20 min", "5 heures").
 * The minutes part is dropped when it is zero, the hours part when there are
 * no full hours.
 * @param {number} minutes - the duration in minutes (negative counts as 0)
 * @param {string} locale - e.g. "fr-FR"
 * @param {"long"|"short"|"narrow"} [unitDisplay] - Intl unit style
 * @returns {Array<{type: "number"|"unit", value: string}>} parts in reading order
 */
export function computeDurationParts(minutes, locale, unitDisplay = "short") {
  const total = Math.max(0, Math.round(minutes || 0))
  const hours = Math.floor(total / 60)
  const remainingMinutes = total % 60
  const amounts = [
    hours > 0 && { unit: "hour", value: hours },
    (remainingMinutes > 0 || hours === 0) && {
      unit: "minute",
      value: remainingMinutes,
    },
  ].filter(Boolean)
  return amounts.flatMap(({ unit, value }) =>
    computeUnitParts(value, unit, locale, unitDisplay),
  )
}

// One amount and its unit, in the order the locale writes them
function computeUnitParts(value, unit, locale, unitDisplay) {
  const parts = new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay,
  }).formatToParts(value)
  const unitIndex = parts.findIndex((part) => part.type === "unit")
  const numberPart = {
    type: "number",
    value: new Intl.NumberFormat(locale).format(value),
  }
  const unitPart = { type: "unit", value: parts[unitIndex]?.value ?? unit }
  const numberIndex = parts.findIndex((part) => part.type === "integer")
  return unitIndex < numberIndex
    ? [unitPart, numberPart]
    : [numberPart, unitPart]
}
