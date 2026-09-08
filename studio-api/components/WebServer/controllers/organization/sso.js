const { encrypt } = require(
  `${process.cwd()}/components/WebServer/config/passport/token/encryption`,
)
const { OrganizationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const PROVIDER_TYPES = ["oidc"]
const DEFAULT_TYPE = "oidc"
const LIST_SEPARATOR = /[\s,]+/
const DEFAULT_SCOPE = ["openid", "email", "profile"]
const OPTIONAL_URLS = ["authorizationUrl", "tokenUrl", "userInfoUrl"]
const DOMAIN_PATTERN = /^(?=.{1,253}$)([a-z0-9-]+\.)+[a-z]{2,}$/

function isBlank(value) {
  return value === undefined || value === null || value === ""
}

function parseType(value) {
  if (isBlank(value)) return DEFAULT_TYPE
  if (!PROVIDER_TYPES.includes(value))
    throw new OrganizationError(
      `Unsupported SSO type, expected one of: ${PROVIDER_TYPES.join(", ")}`,
    )
  return value
}

// https only: the client secret and the users' tokens transit through it.
function parseUrl(value, field, required) {
  if (isBlank(value)) {
    if (required) throw new OrganizationError(`${field} is required`)
    return undefined
  }
  if (typeof value !== "string")
    throw new OrganizationError(`${field} must be a string`)

  let url
  try {
    url = new URL(value.trim())
  } catch (err) {
    throw new OrganizationError(`${field} is not a valid URL`)
  }

  if (url.protocol !== "https:")
    throw new OrganizationError(`${field} must use https`)

  return url.toString().replace(/\/$/, "")
}

// A list field: array of strings, or a string split on commas and spaces.
function parseList(value, field) {
  if (isBlank(value)) return []
  const items = typeof value === "string" ? value.split(LIST_SEPARATOR) : value
  if (!Array.isArray(items))
    throw new OrganizationError(
      `${field} must be a list or a comma separated string`,
    )
  const cleaned = items.filter((s) => !isBlank(s)).map((s) => String(s).trim())
  return [...new Set(cleaned)].filter((s) => s !== "")
}

function parseScope(value) {
  const scope = parseList(value, "scope")
  if (scope.length === 0) return [...DEFAULT_SCOPE]
  if (!scope.includes("openid"))
    throw new OrganizationError("scope must include openid")
  return scope
}

function normalizeDomain(value) {
  return String(value).trim().toLowerCase().replace(/^@/, "")
}

// Domain of the org's matching email ("@acme.com" or "user@acme.com").
function domainFromMatchingMail(matchingMail) {
  if (typeof matchingMail !== "string" || !matchingMail.includes("@"))
    return null
  const domain = normalizeDomain(
    matchingMail.slice(matchingMail.lastIndexOf("@")),
  )
  return DOMAIN_PATTERN.test(domain) ? domain : null
}

// Routing key at login: users whose email domain matches go to this SSO.
// Falls back to the matching email, required when the org has none.
function parseEmailDomains(value, matchingMail) {
  const domains = parseList(value, "emailDomains").map(normalizeDomain)
  for (const domain of domains) {
    if (!DOMAIN_PATTERN.test(domain))
      throw new OrganizationError(`${domain} is not a valid email domain`)
  }
  if (domains.length > 0) return domains

  const fallback = domainFromMatchingMail(matchingMail)
  if (fallback) return [fallback]
  throw new OrganizationError(
    "emailDomains is required when the organization has no matching email",
  )
}

function parseEnabled(value) {
  if (isBlank(value)) return true
  if (value === true || value === "true") return true
  if (value === false || value === "false") return false
  throw new OrganizationError("enabled must be a boolean")
}

function parseClientId(value) {
  if (isBlank(value)) throw new OrganizationError("clientId is required")
  if (typeof value !== "string")
    throw new OrganizationError("clientId must be a string")
  return value.trim()
}

// A stored secret is kept when the request omits it, so the config can be
// updated without re-sending it.
function parseClientSecret(value, current) {
  if (isBlank(value)) {
    if (current && current.clientSecret) return current.clientSecret
    throw new OrganizationError("clientSecret is required")
  }
  if (typeof value !== "string")
    throw new OrganizationError("clientSecret must be a string")
  return encrypt(value)
}

function buildSsoConfig(body, current, { matchingMail } = {}) {
  const sso = {
    type: parseType(body.type),
    enabled: parseEnabled(body.enabled),
    issuerUrl: parseUrl(body.issuerUrl, "issuerUrl", true),
    clientId: parseClientId(body.clientId),
    clientSecret: parseClientSecret(body.clientSecret, current),
    scope: parseScope(body.scope),
    emailDomains: parseEmailDomains(body.emailDomains, matchingMail),
  }

  for (const field of OPTIONAL_URLS) {
    const url = parseUrl(body[field], field, false)
    if (url) sso[field] = url
  }

  return sso
}

// The secret never leaves the server.
function toPublic(sso) {
  const { clientSecret, ...rest } = sso
  return rest
}

module.exports = { buildSsoConfig, toPublic }
