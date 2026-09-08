const debug = require("debug")(
  "linto:components:WebServer:controllers:apikey:exchange",
)
const ms = require("ms")
const randomstring = require("randomstring")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const logger = require(`${process.cwd()}/lib/logger/logger`)
const TokenGenerator = require(
  `${process.cwd()}/components/WebServer/config/passport/token/generator`,
)
const TokenHandler = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/token`,
)
const { addM2mUserToOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)
const {
  ExternalIdentityInvalid,
  ExternalIdentityNotLinked,
  ExternalKeyRevoked,
  ExternalDomainInactive,
} = require(`${process.cwd()}/components/WebServer/error/exception/auth`)
const { normalizeEmail, emailDomain } = require(
  `${process.cwd()}/lib/utility/externalIdentity`,
)
const PLATFORM_ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)

/**
 * Identity bridge: an external identity → a short-lived token of the API key
 * that stands for it.
 *
 * The caller (an INTEGRATION credential, e.g. the Meet backend) proves who the
 * person is (`provider`, `subject`, `email`); this module finds the key linked
 * to that person, or creates one just-in-time when the email's domain is
 * active in the external-domains table of an organization, and mints a token
 * that expires after EXTERNAL_EXCHANGE_TOKEN_TTL (default 1h). The token is a
 * dedicated `tokens` row (kind "exchange"): revocable, distinct from the key
 * itself, and inheriting the key's rights (its organization role). The
 * long-lived key never leaves the database.
 */

const KIND_EXCHANGE = model.tokens.constructor.KIND_EXCHANGE

function exchangeTtl() {
  const raw = process.env.EXTERNAL_EXCHANGE_TOKEN_TTL || "1h"
  const millis = ms(raw)
  if (!millis || millis <= 0) return { raw: "1h", millis: ms("1h") }
  return { raw, millis }
}

function jitKeyRole() {
  const role = parseInt(process.env.EXTERNAL_JIT_KEY_ROLE, 10)
  return Number.isFinite(role) && role >= 1 && role <= 5 ? role : 4
}

function parseRequest(body = {}) {
  if (typeof body.provider !== "string" || body.provider.trim() === "") {
    throw new ExternalIdentityInvalid("provider is required")
  }
  const provider = body.provider.trim()
  const subject =
    typeof body.subject === "string" && body.subject.trim() !== ""
      ? body.subject.trim()
      : null
  let email = null
  if (body.email !== undefined && body.email !== null && body.email !== "") {
    email = normalizeEmail(body.email)
    if (!email) throw new ExternalIdentityInvalid("email is not valid")
  }
  if (!subject && !email) {
    throw new ExternalIdentityInvalid("subject or email is required")
  }
  return { provider, subject, email }
}

function firstOf(result) {
  return Array.isArray(result) && result.length > 0 ? result[0] : null
}

/** The key standing for this identity: (provider, subject) first, then email. */
async function findLinkedKey({ provider, subject, email }) {
  if (subject) {
    const key = firstOf(
      await model.users.findApiKeyByExternalIdentity({ provider, subject }),
    )
    if (key) return key
  }
  if (email) {
    // The email is the pivot between systems: a key provisioned by another
    // provider (e.g. Twake) for the same person is the same person. [P]
    return firstOf(await model.users.findApiKeyByExternalEmail({ email }))
  }
  return null
}

/**
 * Just-in-time key for an email whose domain is active in an organization's
 * external-domains table. [P] several organizations claiming the same domain:
 * the most recently updated record wins.
 */
async function createKeyForActiveDomain({ provider, subject, email }, caller) {
  const domain = emailDomain(email)
  if (!domain) return null
  const records = await model.externalDomains.getByDomain(domain)
  const active = (Array.isArray(records) ? records : []).find((doc) =>
    model.externalDomains.constructor.isActive(doc),
  )
  if (!active) return null

  const identitySubject = subject || email
  const created = await TokenHandler.createApiKey(
    {
      body: {
        name: `${provider}:${identitySubject}`,
        expires_in: process.env.EXTERNAL_JIT_KEY_EXPIRES_IN || "3650d",
        metadata: {
          externalIdentity: { provider, subject: identitySubject, email },
          quickMeeting: true,
          plan: {
            source: "domain",
            domain,
            plan: active.plan || null,
            ai: active.ai || null,
          },
        },
      },
      payload: { data: { userId: caller } },
      params: { organizationId: active.organizationId },
    },
    PLATFORM_ROLE.UNDEFINED,
  )
  const userId = created.user_id.toString()
  await addM2mUserToOrganization(active.organizationId, userId, jitKeyRole())
  logger.info(
    `external exchange: JIT key ${userId} created for ${provider}:${identitySubject} (domain ${domain}, org ${active.organizationId}) by ${caller}`,
  )
  return firstOf(await model.users.getById(userId, true))
}

/** The key's own (non-exchange) token row must still be valid. */
async function assertKeyIsValid(key) {
  const rows = await model.tokens.getTokenByUser(key._id.toString())
  const now = Date.now()
  const valid = (Array.isArray(rows) ? rows : []).some(
    (row) => !row.expiresAt || new Date(row.expiresAt).getTime() > now,
  )
  if (!valid) throw new ExternalKeyRevoked()
}

/**
 * A key provisioned just-in-time for a domain lives as long as the domain is
 * active: the external-domains table is the source of truth (a B2B plan that
 * ends turns every member's key off within one token TTL, with no fan-out
 * revocation). Keys provisioned per person (Twake B2C) are not concerned.
 */
async function assertDomainStillActive(key) {
  const plan = key.metadata?.plan
  if (!plan || plan.source !== "domain" || !plan.domain) return
  const records = await model.externalDomains.get(
    key.metadata.organizationId,
    plan.domain,
  )
  const active = (Array.isArray(records) ? records : []).some((doc) =>
    model.externalDomains.constructor.isActive(doc),
  )
  if (!active) throw new ExternalDomainInactive()
}

async function mintExchangeToken(key, { provider, caller }) {
  const ttl = exchangeTtl()
  const salt = randomstring.generate(12)
  const userId = key._id.toString()
  const row = await model.tokens.insert(userId, salt, ttl.millis, {
    kind: KIND_EXCHANGE,
    provider,
    mintedBy: caller,
  })
  const tokens = TokenGenerator(
    { salt, tokenId: row.insertedId.toString(), userId, role: key.role },
    { expires_in: ttl.raw, refresh: false },
  )
  return {
    token: tokens.auth_token,
    expiresIn: Math.floor(ttl.millis / 1000),
    expiresAt: new Date(Date.now() + ttl.millis).toISOString(),
  }
}

/**
 * Resolve the identity and mint a short token. Returns
 * `{ token, expiresIn, expiresAt, userId, organizationId, capabilities,
 *    externalIdentity, created }`; throws ExternalIdentityNotLinked (404,
 * `no_linked_key`) or ExternalKeyRevoked (403, `revoked`).
 */
async function exchangeExternalIdentity(body, caller) {
  const identity = parseRequest(body)
  let created = false
  let key = await findLinkedKey(identity)
  if (!key && identity.email) {
    key = await createKeyForActiveDomain(identity, caller)
    created = !!key
  }
  if (!key) {
    logger.info(
      `external exchange: no key for ${identity.provider}:${identity.subject || identity.email} (caller ${caller})`,
    )
    throw new ExternalIdentityNotLinked()
  }
  await assertKeyIsValid(key)
  await assertDomainStillActive(key)
  const minted = await mintExchangeToken(key, {
    provider: identity.provider,
    caller,
  })
  logger.info(
    `external exchange: token minted for key ${key._id} (${identity.provider}:${identity.subject || identity.email}, caller ${caller}, ttl ${minted.expiresIn}s)`,
  )
  return {
    ...minted,
    userId: key._id.toString(),
    organizationId: key.metadata?.organizationId || null,
    capabilities: { quickMeeting: key.metadata?.quickMeeting !== false },
    externalIdentity: key.metadata?.externalIdentity || null,
    created,
  }
}

module.exports = {
  exchangeExternalIdentity,
  parseRequest,
  findLinkedKey,
  createKeyForActiveDomain,
  exchangeTtl,
}
