/**
 * External identity carried by an API key (`users.metadata.externalIdentity`).
 *
 * A LinTO API key is a machine user; when it is provisioned for a person of an
 * external system (Twake, a Meet instance, ...), the key carries WHO it stands
 * for: `{ provider, subject, email }`. The identity bridge
 * (POST /api/auth/external/token) resolves that person back to the key. Emails
 * are the pivot between systems, so they are normalised to lowercase
 * everywhere: on write (metadata), on lookup, and in the entitlement
 * records.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeEmail(email) {
  if (typeof email !== "string") return null
  const value = email.trim().toLowerCase()
  return EMAIL_RE.test(value) ? value : null
}

function normalizeDomain(domain) {
  if (typeof domain !== "string") return null
  const value = domain.trim().toLowerCase().replace(/^@/, "")
  return value && !/[\s/@]/.test(value) ? value : null
}

function emailDomain(email) {
  const value = normalizeEmail(email)
  return value ? value.split("@")[1] : null
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim() !== ""
}

/**
 * Validate + normalise an external identity. Returns the clean object or
 * throws a plain Error (callers map it to their HTTP exception).
 */
function parseExternalIdentity(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("externalIdentity must be an object")
  }
  if (!nonEmptyString(raw.provider)) {
    throw new Error("externalIdentity.provider is required")
  }
  const identity = { provider: raw.provider.trim() }
  const hasSubject = nonEmptyString(raw.subject)
  const email = raw.email === undefined ? undefined : normalizeEmail(raw.email)
  if (raw.email !== undefined && !email) {
    throw new Error("externalIdentity.email is not a valid email")
  }
  if (!hasSubject && !email) {
    throw new Error("externalIdentity needs a subject or an email")
  }
  // Without a subject the email IS the subject (e.g. Twake B2B members).
  identity.subject = hasSubject ? String(raw.subject).trim() : email
  if (email) identity.email = email
  return identity
}

/**
 * Normalise the client-provided metadata of an API key: validates
 * `externalIdentity` (when present) and coerces `quickMeeting` to a boolean
 * (when present). Everything else is passed through untouched.
 */
function normalizeApiKeyMetadata(metadata) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {}
  }
  const clean = { ...metadata }
  if (clean.externalIdentity !== undefined) {
    clean.externalIdentity = parseExternalIdentity(clean.externalIdentity)
  }
  if (clean.quickMeeting !== undefined) {
    clean.quickMeeting = parseBoolean(clean.quickMeeting)
  }
  return clean
}

function parseBoolean(value) {
  if (typeof value === "boolean") return value
  if (value === "true" || value === 1 || value === "1") return true
  if (value === "false" || value === 0 || value === "0") return false
  throw new Error("quickMeeting must be a boolean")
}

/**
 * `?externalSubject=<provider>:<subject>` filter → { provider, subject }.
 * The subject may itself contain ':' (only the first one splits).
 */
function parseExternalSubject(value) {
  if (!nonEmptyString(value)) return null
  const idx = value.indexOf(":")
  if (idx <= 0 || idx === value.length - 1) return null
  return {
    provider: value.slice(0, idx).trim(),
    subject: value.slice(idx + 1).trim(),
  }
}

function identityMatches(identity, { provider, subject, email }) {
  if (!identity) return false
  if (provider !== undefined && identity.provider !== provider) return false
  if (subject !== undefined && identity.subject !== subject) return false
  if (email !== undefined && identity.email !== email) return false
  return true
}

module.exports = {
  normalizeEmail,
  normalizeDomain,
  emailDomain,
  parseExternalIdentity,
  normalizeApiKeyMetadata,
  parseExternalSubject,
  identityMatches,
  parseBoolean,
}
