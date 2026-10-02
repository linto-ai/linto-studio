import { splitCommaList } from "../splitCommaList.js"

export function testOidcScope(field, t) {
  field.error = null
  field.valid = splitCommaList(field.value).includes("openid")
  if (!field.valid) field.error = t("organisation.sso.errors.scope_openid")
  return field.valid
}
