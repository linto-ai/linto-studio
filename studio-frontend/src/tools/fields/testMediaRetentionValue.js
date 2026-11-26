export const MEDIA_RETENTION_MAX_VALUE = 120

// Empty (no retention) or a whole number from 1 to the maximum
export function testMediaRetentionValue(field, t) {
  field.error = null
  field.valid = false

  const value = String(field.value ?? "").trim()
  const isDuration =
    /^\d+$/.test(value) &&
    Number(value) >= 1 &&
    Number(value) <= MEDIA_RETENTION_MAX_VALUE

  if (value === "" || isDuration) {
    field.valid = true
  } else {
    field.error = t("organisation.media_retention.value_error", {
      max: MEDIA_RETENTION_MAX_VALUE,
    })
  }
  return field.valid
}
