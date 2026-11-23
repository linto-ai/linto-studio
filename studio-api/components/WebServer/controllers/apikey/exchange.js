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
const {
  ExternalIdentityInvalid,
  ExternalKeyExpired,
  ExternalKeyRevoked,
} = require(`${process.cwd()}/components/WebServer/error/exception/auth`)
const { EntitlementMissing } = require(
  `${process.cwd()}/components/WebServer/error/exception/entitlement`,
)
const { OrganizationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)
const { resolveFeatures } = require(
  `${process.cwd()}/components/WebServer/controllers/entitlement/resolve`,
)
const { capabilitiesFrom, hasActiveFeature, hasLintoFeature } = require(
  `${process.cwd()}/lib/dao/entitlement/features`,
)
const { parseExternalIdentity } = require(
  `${process.cwd()}/lib/utility/externalIdentity`,
)
const { firstOf } = require(`${process.cwd()}/lib/utility/firstOf`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)
const PLATFORM_ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)
const TOKEN_KIND = require(`${process.cwd()}/lib/dao/token/kinds`)

const JIT_KEY_ROLE = ROLES.MEETING_MANAGER
const OBJECT_ID = /^[0-9a-f]{24}$/i

function exchangeTtl() {
  const raw = process.env.EXTERNAL_EXCHANGE_TOKEN_TTL || "1h"
  const millis = ms(raw)
  if (!millis || millis <= 0) return { raw: "1h", millis: ms("1h") }
  return { raw, millis }
}

function parseRequest({ provider, subject, email } = {}) {
  try {
    return parseExternalIdentity({
      provider,
      subject,
      email: email === null || email === "" ? undefined : email,
    })
  } catch (err) {
    throw new ExternalIdentityInvalid(err.message)
  }
}

async function rootOrganization({ organizationId } = {}) {
  if (typeof organizationId !== "string" || !OBJECT_ID.test(organizationId)) {
    throw new ExternalIdentityInvalid(
      "organizationId must be the id of the root organization",
    )
  }
  if (!firstOf(await model.organizations.getById(organizationId))) {
    throw new OrganizationNotFound("Root organization not found")
  }
  return organizationId
}

async function keyOfPerson(identity, root) {
  const keys = await model.users.findApiKeyOfPerson(identity, root)
  return (
    keys.find(
      ({ metadata: { externalIdentity } }) =>
        externalIdentity.provider === identity.provider &&
        externalIdentity.subject === identity.subject,
    ) ||
    keys[0] ||
    null
  )
}

function describe({ provider, subject }) {
  return `${provider}:${subject}`
}

// `recording` alone is answered by resolve, but mints no token
async function resolveRequest(identity, root, { linto = false } = {}) {
  const features = await resolveFeatures(identity, root)
  const active = linto ? hasLintoFeature : hasActiveFeature
  if (!features || !active(features)) {
    logger.info(
      `external exchange: no ${linto ? "LinTO " : ""}entitlement for ${describe(identity)} under ${root}`,
    )
    throw new EntitlementMissing()
  }
  return features
}

async function resolveExternalIdentity(body, caller) {
  const identity = parseRequest(body)
  const root = await rootOrganization(body)
  const features = await resolveRequest(identity, root)
  logger.info(
    `external resolve: ${describe(identity)} under ${root} (caller ${caller})`,
  )
  return { organizationId: root, capabilities: capabilitiesFrom(features) }
}

function isJitKey(key) {
  return key.metadata.justInTime === true
}

async function createJitKey(identity, root, caller) {
  let created
  try {
    created = await TokenHandler.createApiKey({
      name: describe(identity),
      expiresIn: process.env.EXTERNAL_JIT_KEY_EXPIRES_IN,
      metadata: { externalIdentity: identity },
      justInTime: true,
      createdBy: caller,
      organizationId: root,
    })
  } catch (err) {
    if (err.code !== "external_identity_conflict") throw err
    // A concurrent exchange created it first
    return { key: await keyOfPerson(identity, root), created: false }
  }
  const userId = created.user_id.toString()
  logger.info(
    `external exchange: JIT key ${userId} created for ${describe(identity)} in org ${root} by ${caller}`,
  )
  return {
    key: {
      _id: userId,
      type: USER_TYPE.M2M,
      role: PLATFORM_ROLE.UNDEFINED,
      metadata: {
        externalIdentity: identity,
        organizationId: root,
        justInTime: true,
      },
    },
    created: true,
  }
}

// Creation and membership are two steps: an exchange completes a failed one
async function ensureMembership(key) {
  if (!isJitKey(key)) return
  throwIfError(
    await model.organizations.addMember(
      key.metadata.organizationId,
      key._id.toString(),
      JIT_KEY_ROLE,
      USER_TYPE.M2M,
    ),
  )
}

async function assertKeyIsValid(key) {
  const rows = throwIfError(
    await model.tokens.getTokenByUser(key._id.toString()),
  )
  if (rows.length === 0) throw new ExternalKeyRevoked()
  if (!TokenHandler.hasValidToken(rows)) throw new ExternalKeyExpired()
}

async function mintExchangeToken(key, { provider, caller }) {
  const ttl = exchangeTtl()
  const salt = randomstring.generate(12)
  const userId = key._id.toString()
  const row = await model.tokens.insert(userId, salt, ttl.millis, {
    kind: TOKEN_KIND.EXCHANGE,
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

async function exchangeExternalIdentity(body, caller) {
  const identity = parseRequest(body)
  const root = await rootOrganization(body)
  const [features, existing] = await Promise.all([
    resolveRequest(identity, root, { linto: true }),
    keyOfPerson(identity, root),
  ])

  if (existing) await assertKeyIsValid(existing)
  const { key, created } = existing
    ? { key: existing, created: false }
    : await createJitKey(identity, root, caller)
  await ensureMembership(key)

  const minted = await mintExchangeToken(key, {
    provider: identity.provider,
    caller,
  })
  logger.info(
    `external exchange: token minted for key ${key._id} (${describe(identity)}, caller ${caller}, ttl ${minted.expiresIn}s)`,
  )

  return {
    ...minted,
    userId: key._id.toString(),
    organizationId: key.metadata.organizationId,
    capabilities: capabilitiesFrom(features, key),
    externalIdentity: key.metadata.externalIdentity,
    created,
  }
}

module.exports = { exchangeExternalIdentity, resolveExternalIdentity }
