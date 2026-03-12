export function testUrl(field, t) {
  field.error = null
  field.valid = false

  if (!field.value) {
    field.error = t("error.required")
    return false
  }

  field.value = field.value.trim()

  if (field.value.length === 0) {
    field.error = t("error.required")
    return false
  }

  try {
    const url = new URL(field.value)
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      field.error = t("error.invalid_url")
      return false
    }
  } catch {
    field.error = t("error.invalid_url")
    return false
  }

  field.valid = true
  return true
}
