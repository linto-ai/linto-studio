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
const { ExternalIdentityInvalid, ExternalKeyRevoked } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)
const { EntitlementMissing } = require(
  `${process.cwd()}/components/WebServer/error/exception/entitlement`,
)
const { resolveEntitlement, capabilitiesFrom, hasActiveFeature } = require(
  `${process.cwd()}/components/WebServer/controllers/entitlement/resolve`,
)
const { findLinkedKey, hasValidToken } = require(
  `${process.cwd()}/components/WebServer/controllers/entitlement/key`,
)
const { normalizeEmail } = require(
  `${process.cwd()}/lib/utility/externalIdentity`,
)
const PLATFORM_ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)

/**
 * Identity bridge: an external identity → what it may do, and a short-lived
 * token of the API key that stands for it.
 *
 * Two routes, one resolution (`externalEntitlements`, §4.3 [B3]):
 *
 *   resolve  reads the entitlement and answers the capabilities. NO side
 *            effect: no key, no token, no organization. It is what Meet calls
 *            at login and at room opening, so that warming a cache never
 *            creates a key for every member of a paying domain.
 *   token    same resolution, then finds the key standing for that person —
 *            creating it just-in-time, in the organization the resolution
 *            yields, when none exists — and mints a token that expires after
 *            EXTERNAL_EXCHANGE_TOKEN_TTL (default 1h) as a dedicated `tokens`
 *            row (kind "exchange"), revocable on its own.
 *
 * The key carries the IDENTITY only: no rights, no plan. Rights are read from
 * the entitlement at every call, here and in the server gates, so a revocation
 * pushed by the external system bites at once — whatever Meet has cached and
 * whatever is left of the short token.
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

/**
 * Parse + resolve. An identity with no record, or one whose every feature is
 * off, has no entitlement at all: 404 `no_entitlement`, and the caller shows
 * "the AI option is not enabled for your account".
 */
async function resolveRequest(body) {
  const identity = parseRequest(body)
  const resolved = await resolveEntitlement(identity)
  if (!resolved || !hasActiveFeature(resolved.features)) {
    logger.info(
      `external exchange: no entitlement for ${identity.provider}:${identity.subject || identity.email}`,
    )
    throw new EntitlementMissing()
  }
  return { identity, resolved }
}

/**
 * [B3a] POST /api/auth/external/resolve — capabilities, nothing else.
 * Reading rights must never provision anything.
 */
async function resolveExternalIdentity(body, caller) {
  const { identity, resolved } = await resolveRequest(body)
  logger.info(
    `external resolve: ${identity.provider}:${identity.subject || identity.email} → org ${resolved.organizationId} (caller ${caller})`,
  )
  return {
    organizationId: resolved.organizationId,
    capabilities: capabilitiesFrom(resolved.features),
  }
}

/**
 * The key of a person who has an entitlement but no key yet: created in the
 * organization the resolution yields (the domain's for a B2B member, the root
 * for a B2C one), carrying the identity and nothing else.
 */
async function createJitKey({ provider, subject, email }, resolved, caller) {
  const identitySubject = subject || email
  const organizationId = resolved.organizationId
  const created = await TokenHandler.createApiKey(
    {
      body: {
        name: `${provider}:${identitySubject}`,
        expires_in: process.env.EXTERNAL_JIT_KEY_EXPIRES_IN || "3650d",
        metadata: {
          externalIdentity: { provider, subject: identitySubject, email },
          quickMeeting: true,
        },
      },
      payload: { data: { userId: caller } },
      params: { organizationId },
    },
    PLATFORM_ROLE.UNDEFINED,
  )
  const userId = created.user_id.toString()
  await addM2mUserToOrganization(organizationId, userId, jitKeyRole())
  logger.info(
    `external exchange: JIT key ${userId} created for ${provider}:${identitySubject} in org ${organizationId} by ${caller}`,
  )
  return firstOf(await model.users.getById(userId, true))
}

function firstOf(result) {
  return Array.isArray(result) && result.length > 0 ? result[0] : null
}

/**
 * The key's own (non-exchange) token row must still be valid. An entitlement
 * that comes back re-activates the key (see the entitlements routes); a key an
 * administrator revoked by hand stays revoked.
 */
async function assertKeyIsValid(key) {
  const rows = await model.tokens.getTokenByUser(key._id.toString())
  if (!hasValidToken(rows)) throw new ExternalKeyRevoked()
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
 * [B3b] POST /api/auth/external/token. Returns
 * `{ token, expiresIn, expiresAt, userId, organizationId, capabilities,
 *    externalIdentity, created }`; throws EntitlementMissing (404,
 * `no_entitlement`) or ExternalKeyRevoked (403, `revoked`).
 */
async function exchangeExternalIdentity(body, caller) {
  const { identity, resolved } = await resolveRequest(body)

  let key = await findLinkedKey(identity)
  let created = false
  if (!key) {
    key = await createJitKey(identity, resolved, caller)
    created = true
  }
  await assertKeyIsValid(key)

  const minted = await mintExchangeToken(key, {
    provider: identity.provider,
    caller,
  })
  logger.info(
    `external exchange: token minted for key ${key._id} (${identity.provider}:${identity.subject || identity.email}, caller ${caller}, ttl ${minted.expiresIn}s)`,
  )

  const capabilities = capabilitiesFrom(resolved.features)
  // The rights come from the entitlement; a key explicitly barred from quick
  // meetings (metadata.quickMeeting: false) still cannot start one.
  if (key.metadata?.quickMeeting === false) capabilities.quickMeeting = false

  return {
    ...minted,
    userId: key._id.toString(),
    organizationId: key.metadata?.organizationId || resolved.organizationId,
    capabilities,
    externalIdentity: key.metadata?.externalIdentity || null,
    created,
  }
}

module.exports = {
  exchangeExternalIdentity,
  resolveExternalIdentity,
  parseRequest,
  createJitKey,
  exchangeTtl,
}
