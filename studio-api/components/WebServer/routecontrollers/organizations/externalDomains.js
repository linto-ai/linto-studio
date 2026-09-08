const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organizations:externalDomains",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const ExternalDomainModel = model.externalDomains.constructor

const { OrganizationError, OrganizationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)
const { normalizeDomain, parseBoolean } = require(
  `${process.cwd()}/lib/utility/externalIdentity`,
)

/**
 * External domains of an organization (`/api/organizations/{id}/external-domains`).
 *
 * `{ paying, ai: { transcription, liveMinutesPerMonth }, plan, updatedAt }`
 * per email domain, pushed by an external billing system (Twake B2B
 * `domain.subscription.changed`) or set once by hand. A domain is ACTIVE when
 * `paying && ai.transcription`; the identity bridge then creates an API key
 * just-in-time for any email of that domain. PUT is an idempotent upsert.
 */

function present(doc) {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { ...rest, active: ExternalDomainModel.isActive(doc) }
}

function parseBody(body = {}) {
  const values = {}
  if (body.paying !== undefined) values.paying = parseBoolean(body.paying)
  if (body.ai !== undefined) {
    if (!body.ai || typeof body.ai !== "object" || Array.isArray(body.ai)) {
      throw new OrganizationError("ai must be an object")
    }
    const ai = { ...body.ai }
    if (ai.transcription !== undefined) {
      ai.transcription = parseBoolean(ai.transcription)
    }
    if (ai.liveMinutesPerMonth !== undefined) {
      const n = Number(ai.liveMinutesPerMonth)
      if (!Number.isFinite(n)) {
        throw new OrganizationError("ai.liveMinutesPerMonth must be a number")
      }
      ai.liveMinutesPerMonth = n
    }
    values.ai = ai
  }
  if (body.plan !== undefined) {
    if (body.plan !== null && typeof body.plan !== "string") {
      throw new OrganizationError("plan must be a string")
    }
    values.plan = body.plan
  }
  if (body.updatedAt !== undefined) {
    const date = new Date(body.updatedAt)
    if (Number.isNaN(date.getTime())) {
      throw new OrganizationError("updatedAt must be a date")
    }
    values.updatedAt = date.toISOString()
  } else {
    values.updatedAt = new Date().toISOString()
  }
  return values
}

function requireDomain(params) {
  const domain = normalizeDomain(params.domain)
  if (!domain) throw new OrganizationError("Invalid domain")
  return domain
}

async function listExternalDomains(req, res, next) {
  try {
    const docs = await model.externalDomains.getByOrganization(
      req.params.organizationId,
    )
    res.status(200).send(docs.map(present))
  } catch (err) {
    next(err)
  }
}

async function getExternalDomain(req, res, next) {
  try {
    const domain = requireDomain(req.params)
    const docs = await model.externalDomains.get(
      req.params.organizationId,
      domain,
    )
    if (docs.length !== 1) throw new OrganizationNotFound("Domain not found")
    res.status(200).send(present(docs[0]))
  } catch (err) {
    next(err)
  }
}

async function upsertExternalDomain(req, res, next) {
  try {
    const domain = requireDomain(req.params)
    let values
    try {
      values = parseBody(req.body)
    } catch (err) {
      throw new OrganizationError(err.message)
    }
    const organizationId = req.params.organizationId
    const existing = await model.externalDomains.get(organizationId, domain)
    const merged = {
      paying: false,
      ai: { transcription: false },
      plan: null,
      ...(existing[0] || {}),
      ...values,
      // `ai` is replaced as a whole when given (the billing system owns it).
      ...(values.ai ? { ai: values.ai } : {}),
    }
    if (!existing[0]) merged.created = new Date().toISOString()
    const result = await model.externalDomains.upsert(
      organizationId,
      domain,
      merged,
    )
    if (!result || (result.matchedCount === 0 && !result.upsertedCount)) {
      throw new OrganizationError("Domain not updated")
    }
    const docs = await model.externalDomains.get(organizationId, domain)
    res.status(existing[0] ? 200 : 201).send(present(docs[0]))
  } catch (err) {
    next(err)
  }
}

async function deleteExternalDomain(req, res, next) {
  try {
    const domain = requireDomain(req.params)
    const result = await model.externalDomains.delete(
      req.params.organizationId,
      domain,
    )
    if (!result || result.deletedCount === 0) {
      throw new OrganizationNotFound("Domain not found")
    }
    res.status(200).send({ message: "External domain removed", domain })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listExternalDomains,
  getExternalDomain,
  upsertExternalDomain,
  deleteExternalDomain,
  parseBody,
}
