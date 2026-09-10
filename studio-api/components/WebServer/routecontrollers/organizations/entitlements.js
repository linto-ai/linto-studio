const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organizations:entitlements",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const logger = require(`${process.cwd()}/lib/logger/logger`)

const EntitlementModel = model.externalEntitlements.constructor
const KIND_USER = EntitlementModel.KIND_USER
const KIND_DOMAIN = EntitlementModel.KIND_DOMAIN

const { EntitlementInvalid, EntitlementNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/entitlement`,
)
const { ensureDomainOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/externalDomain`,
)
const { revokeLinkedKey, reactivateLinkedKey } = require(
  `${process.cwd()}/components/WebServer/controllers/entitlement/key`,
)
const { normalizeEmail, normalizeDomain } = require(
  `${process.cwd()}/lib/utility/externalIdentity`,
)

/**
 * Entitlements API v1 (`/api/v1/organizations/{org}/entitlements`), the
 * surface an external system (Twake…) calls to declare the AI rights of its
 * users and of its organizations. See `docs-twake/contrat-api-entitlements.md`.
 *
 *   PUT    users/{email}      upsert a person's state (never creates a key)
 *   DELETE users/{email}      the person is gone: erase their state
 *   PUT    domains/{domain}   upsert an organization's state; creates the
 *                             Studio organization of that domain, once
 *   GET    users/{email}, GET domains/{domain}   support and replay control
 *
 * `{org}` is the ROOT organization of that external system; B2C users live
 * there, and each declared domain gets its own organization attached to it.
 * Everything is idempotent: a replay of the whole message history, in order or
 * not, lands on the same state (upsert + `updatedAt` order guard). No route
 * ever deletes an organization.
 */

const DEFAULT_PROVIDER =
  process.env.EXTERNAL_ENTITLEMENTS_DEFAULT_PROVIDER || "external"

function invalid(detail) {
  return new EntitlementInvalid(detail, { error: detail })
}

function firstOf(result) {
  return Array.isArray(result) && result.length > 0 ? result[0] : null
}

/**
 * The provider an external system writes under. It is not part of the
 * contract (one system, one root organization): the default names it. A
 * caller may still pin one to keep several systems apart under one root. [P]
 */
function resolveProvider(body = {}) {
  if (body.provider === undefined) return DEFAULT_PROVIDER
  if (typeof body.provider !== "string" || body.provider.trim() === "") {
    throw invalid("provider must be a non-empty string")
  }
  return body.provider.trim()
}

/**
 * `features` is a nested, extensible object: `{ transcription: { live, async },
 * summary, translation, … }`. Leaves are booleans, an absent key is false, an
 * unknown key is kept as it comes (and ignored until Studio knows it).
 */
function parseFeatures(raw, path = "features") {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw invalid(`${path} must be an object`)
  }
  const clean = {}
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "boolean") clean[key] = value
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      clean[key] = parseFeatures(value, `${path}.${key}`)
    } else {
      throw invalid(`${path}.${key} must be a boolean or an object`)
    }
  }
  return clean
}

function parseBody(body, kind) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw invalid("a JSON object body is required")
  }
  if (body.features === undefined) throw invalid("features is required")
  const values = { features: parseFeatures(body.features) }

  if (kind === KIND_USER && body.subject !== undefined) {
    if (body.subject !== null && typeof body.subject !== "string") {
      throw invalid("subject must be a string")
    }
    values.subject = body.subject ? body.subject.trim() : null
  }
  if (kind === KIND_DOMAIN && body.subject !== undefined) {
    throw invalid("subject does not apply to a domain")
  }
  if (body.plan !== undefined) {
    if (body.plan !== null && typeof body.plan !== "string") {
      throw invalid("plan must be a string")
    }
    values.plan = body.plan
  }
  if (body.updatedAt !== undefined) {
    const date = new Date(body.updatedAt)
    if (Number.isNaN(date.getTime())) throw invalid("updatedAt must be a date")
    values.updatedAt = date.toISOString()
    values.updatedAtGiven = true
  } else {
    values.updatedAt = new Date().toISOString()
    values.updatedAtGiven = false
  }
  return values
}

// Express already decodes the path parameter; a client that percent-encoded
// the email twice (the contract asks for one encoding) still lands right.
function safeDecode(raw) {
  try {
    return decodeURIComponent(raw || "")
  } catch {
    return raw || ""
  }
}

function requireEmail(raw) {
  const email = normalizeEmail(safeDecode(raw))
  if (!email) throw invalid("email is not valid")
  return email
}

function requireDomain(raw) {
  const domain = normalizeDomain(safeDecode(raw))
  if (!domain) throw invalid("domain is not valid")
  return domain
}

function present(doc) {
  if (!doc) return null
  const { _id, last_update, created, ...rest } = doc
  return { plan: null, ...rest }
}

/** A PUT older than the state we hold is ignored (`200 {ignored: true}`). */
function isStale(existing, updatedAt, updatedAtGiven) {
  if (!existing || !updatedAtGiven || !existing.updatedAt) return false
  return new Date(updatedAt).getTime() < new Date(existing.updatedAt).getTime()
}

async function putUserEntitlement(req, res, next) {
  try {
    const organizationId = req.params.organizationId
    const email = requireEmail(req.params.email)
    const provider = resolveProvider(req.body)
    const values = parseBody(req.body, KIND_USER)

    const key = { organizationId, provider, kind: KIND_USER, email }
    const existing = firstOf(
      await model.externalEntitlements.getUser(organizationId, provider, email),
    )
    if (isStale(existing, values.updatedAt, values.updatedAtGiven)) {
      return res.status(200).send({ ...present(existing), ignored: true })
    }

    const subject =
      values.subject !== undefined
        ? values.subject
        : (existing?.subject ?? null)
    const record = {
      ...key,
      subject,
      features: values.features,
      plan: values.plan !== undefined ? values.plan : (existing?.plan ?? null),
      updatedAt: values.updatedAt,
    }
    const result = await model.externalEntitlements.upsert(key, {
      ...record,
      ...(existing ? {} : { created: new Date().toISOString() }),
    })
    if (!result || (result.matchedCount === 0 && !result.upsertedCount)) {
      throw new EntitlementInvalid("Entitlement not written")
    }

    // The key carries the identity, never the rights: taking every feature
    // away drops its tokens (hygiene), giving them back re-activates it.
    const identity = { provider, subject: subject || email, email }
    if (EntitlementModel.hasActiveFeature(record.features)) {
      await reactivateLinkedKey(identity)
    } else {
      await revokeLinkedKey(identity)
    }

    logger.info(
      `entitlements: user ${email} set on ${organizationId} (${provider})`,
    )
    res.status(200).send(present(record))
  } catch (err) {
    next(err)
  }
}

async function deleteUserEntitlement(req, res, next) {
  try {
    const organizationId = req.params.organizationId
    const email = requireEmail(req.params.email)
    const provider = resolveProvider(req.body)

    const existing = firstOf(
      await model.externalEntitlements.getUser(organizationId, provider, email),
    )
    await model.externalEntitlements.deleteOne({
      organizationId,
      provider,
      kind: KIND_USER,
      email,
    })
    await revokeLinkedKey({
      provider,
      subject: existing?.subject || email,
      email,
    })

    logger.info(
      `entitlements: user ${email} erased from ${organizationId} (${provider})`,
    )
    res.status(204).send()
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
    if (!existing) throw new EntitlementNotFound()
    res.status(200).send(present(existing))
  } catch (err) {
    next(err)
  }
}

async function putDomainEntitlement(req, res, next) {
  try {
    const organizationId = req.params.organizationId
    const domain = requireDomain(req.params.domain)
    const provider = resolveProvider(req.body)
    const values = parseBody(req.body, KIND_DOMAIN)

    const key = { organizationId, provider, kind: KIND_DOMAIN, domain }
    const existing = firstOf(
      await model.externalEntitlements.getDomain(
        organizationId,
        provider,
        domain,
      ),
    )
    if (isStale(existing, values.updatedAt, values.updatedAtGiven)) {
      return res.status(200).send({ ...present(existing), ignored: true })
    }

    // The organization of the domain is created once and never removed: the
    // rights come and go, the organization and its data stay.
    const { organization } = await ensureDomainOrganization({
      rootOrganizationId: organizationId,
      domain,
      provider,
      callerId: req.payload.data.userId,
    })

    const record = {
      ...key,
      domainOrganizationId: organization._id.toString(),
      features: values.features,
      plan: values.plan !== undefined ? values.plan : (existing?.plan ?? null),
      updatedAt: values.updatedAt,
    }
    const result = await model.externalEntitlements.upsert(key, {
      ...record,
      ...(existing ? {} : { created: new Date().toISOString() }),
    })
    if (!result || (result.matchedCount === 0 && !result.upsertedCount)) {
      throw new EntitlementInvalid("Entitlement not written")
    }

    logger.info(
      `entitlements: domain ${domain} set on ${organizationId} (${provider}, org ${record.domainOrganizationId})`,
    )
    res.status(200).send(present(record))
  } catch (err) {
    next(err)
  }
}

async function getDomainEntitlement(req, res, next) {
  try {
    const domain = requireDomain(req.params.domain)
    const provider = resolveProvider(req.query)
    const existing = firstOf(
      await model.externalEntitlements.getDomain(
        req.params.organizationId,
        provider,
        domain,
      ),
    )
    if (!existing) throw new EntitlementNotFound()
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
  parseBody,
  parseFeatures,
  present,
  isStale,
}
