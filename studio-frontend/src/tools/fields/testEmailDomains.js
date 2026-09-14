import { splitCommaList } from "../splitCommaList.js"
import { normalizeEmailDomain } from "../normalizeEmailDomain.js"
import { isEmailDomain } from "../isEmailDomain.js"

export function testEmailDomains(field, t) {
  field.error = null
  field.valid = false
  const domains = splitCommaList(field.value).map(normalizeEmailDomain)
  const invalid = domains.find((domain) => !isEmailDomain(domain))
  if (invalid !== undefined) {
    field.error = t("organisation.sso.errors.invalid_domain", {
      domain: invalid,
    })
    return false
  }
  field.valid = true
  return true
}
