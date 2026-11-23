const model = require(`${process.cwd()}/lib/mongodb/models`)
const logger = require(`${process.cwd()}/lib/logger/logger`)
const KIND = require(`${process.cwd()}/lib/dao/entitlement/kinds`)

const { EntitlementInvalid, EntitlementNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/entitlement`,
)
const { parseFeatures } = require(
  `${process.cwd()}/lib/dao/entitlement/features`,
)
const { validEmail, validDomain } = require(
  `${process.cwd()}/lib/utility/emailDomain`,
)
const { firstOf } = require(`${process.cwd()}/lib/utility/firstOf`)

const DEFAULT_PROVIDER = "external"

function invalid(detail) {
  return new EntitlementInvalid(detail, { error: detail })
}

function resolveProvider(source = {}) {
  if (source.provider === undefined) return DEFAULT_PROVIDER
  if (typeof source.provider !== "string" || source.provider.trim() === "") {
    throw invalid("provider must be a non-empty string")
  }
  return source.provider.trim()
}

function parseUpdatedAt(raw) {
  if (raw === undefined) return undefined
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) throw invalid("updatedAt must be a date")
  return date
}

function parseBody(body, kind) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw invalid("a JSON object body is required")
  }
  if (body.features === undefined) throw invalid("features is required")
  const values = {}
  try {
    values.features = parseFeatures(body.features)
  } catch (err) {
    throw invalid(err.message)
  }

  if (kind === KIND.USER && body.subject !== undefined) {
    if (body.subject !== null && typeof body.subject !== "string") {
      throw invalid("subject must be a string")
    }
    values.subject = body.subject ? body.subject.trim() : null
  }
  if (kind === KIND.DOMAIN && body.subject !== undefined) {
    throw invalid("subject does not apply to a domain")
  }
  if (body.plan !== undefined) {
    if (body.plan !== null && typeof body.plan !== "string") {
      throw invalid("plan must be a string")
    }
    values.plan = body.plan
  }
  if (body.updatedAt !== undefined)
    values.updatedAt = parseUpdatedAt(body.updatedAt)
  return values
}

// Express already decodes the parameter: this lands an email encoded twice
function safeDecode(raw) {
  try {
    return decodeURIComponent(raw || "")
  } catch {
    return raw || ""
  }
}

function requireEmail(raw) {
  const email = validEmail(safeDecode(raw))
  if (!email) throw invalid("email is not valid")
  return email
}

function requireDomain(raw) {
  const domain = validDomain(safeDecode(raw))
  if (!domain) throw invalid("domain is not valid")
  return domain
}

function present(doc) {
  const { _id, last_update, created, ...rest } = doc
  return rest
}

// A field the message leaves out keeps its stored value, or `defaults` on a
// new record. False when a later state is held: nothing is written then.
async function writeRecord(key, values, defaults) {
  const set = { features: values.features }
  const onInsert = {}
  for (const [field, fallback] of Object.entries(defaults)) {
    if (values[field] !== undefined) set[field] = values[field]
    else onInsert[field] = fallback
  }
  if (values.updatedAt) set.updatedAt = values.updatedAt
  return model.externalEntitlements.upsertUnlessNewer(key, set, onInsert)
}

function answer(res, written, record) {
  res
    .status(200)
    .send(written ? present(record) : { ...present(record), ignored: true })
}

async function putUserEntitlement(req, res, next) {
  try {
    const organizationId = req.params.organizationId
    const email = requireEmail(req.params.email)
    const provider = resolveProvider(req.body)
    const values = parseBody(req.body, KIND.USER)

    const written = await writeRecord(
      { organizationId, provider, kind: KIND.USER, email },
      values,
      { subject: null, plan: null },
    )
    const stored = firstOf(
      await model.externalEntitlements.getUser(organizationId, provider, email),
    )

    if (written) {
      logger.info(
        `entitlements: user ${email} set on ${organizationId} (${provider})`,
      )
    }
    answer(res, written, stored)
  } catch (err) {
    next(err)
  }
}

async function deleteUserEntitlement(req, res, next) {
  try {
    const organizationId = req.params.organizationId
    const email = requireEmail(req.params.email)
    const provider = resolveProvider(req.query)
    const updatedAt = parseUpdatedAt(req.query.updatedAt)

    const key = { organizationId, provider, kind: KIND.USER, email }
    const deleted = await model.externalEntitlements.deleteUnlessNewer(
      key,
      updatedAt,
    )
    if (!deleted && updatedAt) {
      const newer = firstOf(
        await model.externalEntitlements.getUser(
          organizationId,
          provider,
          email,
        ),
      )
      if (newer) return answer(res, false, newer)
    }

    if (deleted) {
      logger.info(
        `entitlements: user ${email} erased from ${organizationId} (${provider})`,
      )
    }
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

async function putDomainEntitlement(req, res, next) {
  try {
    const organizationId = req.params.organizationId
    const domain = requireDomain(req.params.domain)
    const provider = resolveProvider(req.body)
    const values = parseBody(req.body, KIND.DOMAIN)

    const key = { organizationId, provider, kind: KIND.DOMAIN, domain }
    const written = await writeRecord(key, values, { plan: null })
    const stored = firstOf(
      await model.externalEntitlements.getDomain(
        organizationId,
        provider,
        domain,
      ),
    )

    if (written) {
      logger.info(
        `entitlements: domain ${domain} set on ${organizationId} (${provider})`,
      )
    }
    answer(res, written, stored)
  } catch (err) {
    next(err)
  }
}

async function getUserEntitlement(req, res, next) {
  try {
    const email = requireEmail(req.params.email)
    const provider = resolveProvider(req.query)
    const existing = firstOf(
      await model.externalEntitlements.getUser(
        req.params.organizationId,
        provider,
        email,
      ),
    )
    if (!existing) return next(new EntitlementNotFound())
    res.status(200).send(present(existing))
  } catch (err) {
    next(err)
  }
}

async function getDomainEntitlement(req, res, next) {
  try {
    const organizationId = req.params.organizationId
    const domain = requireDomain(req.params.domain)
    const provider = resolveProvider(req.query)
    const existing = firstOf(
      await model.externalEntitlements.getDomain(
        organizationId,
        provider,
        domain,
      ),
    )
    if (!existing) return next(new EntitlementNotFound())
    res.status(200).send(present(existing))
  } catch (err) {
    next(err)
  }
}

module.exports = {
  putUserEntitlement,
  deleteUserEntitlement,
  getUserEntitlement,
  putDomainEntitlement,
  getDomainEntitlement,
}
