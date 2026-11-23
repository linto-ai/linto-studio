// One rule for "the domain of an email": lowercase, no leading "@".
const DOMAIN_PATTERN = /^(?=.{1,253}$)([a-z0-9-]+\.)+[a-z]{2,}$/

function normalizeEmailDomain(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
}

// "User@Acme.COM" or "@acme.com" -> "acme.com", null without a domain part
function emailDomain(email) {
  if (typeof email !== "string") return null
  const at = email.lastIndexOf("@")
  if (at < 0) return null
  return normalizeEmailDomain(email.slice(at)) || null
}

function isEmailDomain(value) {
  return DOMAIN_PATTERN.test(value)
}

// A non-empty local part without spaces, then a valid domain
function isEmail(value) {
  if (typeof value !== "string") return false
  const at = value.lastIndexOf("@")
  if (at < 1 || /\s/.test(value)) return false
  return isEmailDomain(normalizeEmailDomain(value.slice(at)))
}

// Normalize an email address so invitation, self sign-up and OIDC login
// all resolve to the same account regardless of casing/whitespace.
// Email lookups in Mongo are exact and case sensitive, while the OIDC
// provider may return a capitalized email claim, so both writes and
// lookups must be normalized consistently.
function normalizeEmail(email) {
  if (typeof email !== "string") return email
  return email.trim().toLowerCase()
}

// The normalized email, null when the value is not one
function validEmail(email) {
  const value = normalizeEmail(email)
  return isEmail(value) ? value : null
}

module.exports = {
  emailDomain,
  normalizeEmailDomain,
  isEmailDomain,
  isEmail,
  normalizeEmail,
  validEmail,
}
