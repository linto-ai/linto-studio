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

module.exports = { emailDomain, normalizeEmailDomain, isEmailDomain }
