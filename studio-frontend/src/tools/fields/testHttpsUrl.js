// Empty is valid here: the required check belongs to formsMixin (field.required)
export function testHttpsUrl(field, t) {
  field.error = null
  field.valid = false
  field.value = field.value.trim()
  if (field.value.length === 0) {
    field.valid = true
    return true
  }
  try {
    field.valid = new URL(field.value).protocol === "https:"
  } catch {
    field.valid = false
  }
  if (!field.valid) field.error = t("organisation.sso.errors.invalid_https_url")
  return field.valid
}
