const { validEmail } = require(`${process.cwd()}/lib/utility/emailDomain`)

function nonEmptyString(value) {
  return typeof value === "string" && value.trim() !== ""
}

function parseExternalIdentity(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("externalIdentity must be an object")
  }
  if (!nonEmptyString(raw.provider)) {
    throw new Error("externalIdentity.provider is required")
  }
  const identity = { provider: raw.provider.trim() }
  const hasSubject = nonEmptyString(raw.subject)
  const email = raw.email === undefined ? undefined : validEmail(raw.email)
  if (raw.email !== undefined && !email) {
    throw new Error("externalIdentity.email is not a valid email")
  }
  if (!hasSubject && !email) {
    throw new Error("externalIdentity needs a subject or an email")
  }
  identity.subject = hasSubject ? raw.subject.trim() : email
  if (email) identity.email = email
  return identity
}

// `<provider>:<subject>`, the subject may itself contain ':'
function parseExternalSubject(value) {
  if (!nonEmptyString(value)) return null
  const idx = value.indexOf(":")
  if (idx <= 0 || idx === value.length - 1) return null
  return {
    provider: value.slice(0, idx).trim(),
    subject: value.slice(idx + 1).trim(),
  }
}

module.exports = {
  parseExternalIdentity,
  parseExternalSubject,
}
