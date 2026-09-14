import { splitCommaList } from "./splitCommaList.js"
import { normalizeEmailDomain } from "./normalizeEmailDomain.js"

const OPTIONAL_URLS = ["authorizationUrl", "tokenUrl", "userInfoUrl"]

// Form values -> PUT /organizations/:id/sso body. Empty optional fields are
// left out; an empty secret means "keep the stored one".
export function buildSsoPayload(values) {
  const payload = {
    type: "oidc",
    enabled: values.enabled === true,
    issuerUrl: values.issuerUrl.trim(),
    clientId: values.clientId.trim(),
    scope: splitCommaList(values.scope),
    emailDomains: splitCommaList(values.emailDomains).map(normalizeEmailDomain),
  }
  if (values.clientSecret) payload.clientSecret = values.clientSecret
  for (const field of OPTIONAL_URLS) {
    const url = (values[field] ?? "").trim()
    if (url) payload[field] = url
  }
  return payload
}
