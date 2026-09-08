import { normalizeUrl } from "../normalizeUrl.js"
import { isValidUrl } from "../isValidUrl.js"

// Same normalization as the other URL fields (https:// prepended when no
// scheme), then https only. Empty is valid: required belongs to formsMixin.
export function testHttpsUrl(field, t) {
  field.error = null
  field.valid = false
  field.value = normalizeUrl(field.value)
  if (field.value === "") {
    field.valid = true
    return true
  }
  field.valid = isValidUrl(field.value) && field.value.startsWith("https://")
  if (!field.valid) field.error = t("organisation.sso.errors.invalid_https_url")
  return field.valid
}
