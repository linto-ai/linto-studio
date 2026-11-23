const debug = require("debug")(
  "linto:components:WebServer:controllers:apikey:token",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const ms = require("ms")
const randomstring = require("randomstring")
const TokenGenerator = require(
  `${process.cwd()}/components/WebServer/config/passport/token/generator`,
)
const { UserError, UserNotFound, UserConflict } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const PLATFORM_ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const { parseExternalIdentity } = require(
  `${process.cwd()}/lib/utility/externalIdentity`,
)
const { isDuplicateKey } = require(
  `${process.cwd()}/lib/mongodb/error/customErrors`,
)

// Token routes take a user id: only machine accounts may be handled here
async function getApiKeyUser(userId) {
  const user = await model.users.listApiKeyList([userId])
  if (user.length !== 1) throw new UserNotFound("API key not found")
  return user[0]
}

function getExpiresIn(value, defaultValue = "14d") {
  defaultValue = process.env.EXTENDED_TOKEN_DAYS_TIME || defaultValue
  try {
    if (value === undefined) return ms(defaultValue)

    if (value) return ms(value)
    else return ms(defaultValue)
  } catch {
    return ms(defaultValue)
  }
}

async function generateApiKeyToken(
  user,
  token,
  expires_in = process.env.EXTENDED_TOKEN_DAYS_TIME,
) {
  try {
    expires_in = getExpiresIn(expires_in)
    let token_salt
    if (token === undefined) {
      token_salt = randomstring.generate(12)
      const tokenCreatedAt = new Date()
      const tokenExpiresAt = new Date(Date.now() + expires_in)
      const [insertedToken] = await Promise.all([
        model.tokens.insert(user._id, token_salt, expires_in, true),
        model.users.update({
          _id: user._id.toString(),
          tokenCreatedAt,
          tokenExpiresAt,
        }),
      ])
      token = insertedToken
    } else {
      token_salt = token.salt
    }

    let tokenData = {
      salt: token_salt,
      tokenId: token.insertedId || token._id.toString(),
      userId: user._id,
      role: user.role,
    }

    return TokenGenerator(tokenData, {
      expires_in: token.expiresIn || expires_in,
    })
  } catch (error) {
    throw error
  }
}

function parseBoolean(value) {
  if (typeof value === "boolean") return value
  if (value === "true" || value === 1 || value === "1") return true
  if (value === "false" || value === 0 || value === "0") return false
  throw new Error("quickMeeting must be a boolean")
}

function parseClientMetadata(raw) {
  let parsed = raw
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw)
    } catch {
      parsed = {}
    }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}
  const metadata = { ...parsed }
  try {
    if (metadata.externalIdentity !== undefined) {
      metadata.externalIdentity = parseExternalIdentity(
        metadata.externalIdentity,
      )
    }
    if (metadata.quickMeeting !== undefined) {
      metadata.quickMeeting = parseBoolean(metadata.quickMeeting)
    }
  } catch (err) {
    throw new UserError(`Invalid metadata: ${err.message}`)
  }
  return metadata
}

function identityConflict({ provider, subject }) {
  return new UserConflict(
    `An API key already stands for ${provider}:${subject} in this organization`,
    { code: "external_identity_conflict" },
  )
}

async function assertExternalIdentityIsFree(identity, organizationId) {
  if (!identity) return
  const existing = await model.users.findApiKeyByExternalIdentity(
    { provider: identity.provider, subject: identity.subject },
    { organizationId },
  )
  if (existing.length > 0) throw identityConflict(identity)
}

async function createApiKey({
  name,
  expiresIn,
  metadata: rawMetadata,
  createdBy,
  organizationId,
  role = PLATFORM_ROLE.UNDEFINED,
}) {
  const clientMetadata = parseClientMetadata(rawMetadata)
  const identity = clientMetadata.externalIdentity
  await assertExternalIdentityIsFree(identity, organizationId)

  const createdUser = await model.users.createApiKey(
    {
      firstname: name || "API Key",
      lastname: "",
      metadata: {
        ...clientMetadata,
        createdBy,
        organizationId,
      },
    },
    role,
  )
  if (identity && isDuplicateKey(createdUser.error)) {
    throw identityConflict(identity)
  }
  if (createdUser.insertedCount !== 1) throw new UserError()

  return await generateApiKeyToken(
    { _id: createdUser.insertedId, role },
    undefined,
    expiresIn,
  )
}

async function listApiKey(idList, orgaRoles = undefined) {
  if (idList.list) {
    idList = idList.list.map((u) => u._id.toString())
  }

  const projection = {
    _id: true,
    metadata: true,
    firstname: true,
    lastname: true,
    role: true,
    img: true,
    tokenCreatedAt: true,
    tokenExpiresAt: true,
  }
  const users = await model.users.listApiKeyList(idList, projection)
  const tokens = await model.tokens.getTokenByList(idList)

  const userMap = new Map(
    users.filter((u) => u._id).map((u) => [u._id.toString(), u]),
  )
  const tokenMap = new Map(tokens.map((t) => [t.userId, t]))
  const roleMap = new Map(orgaRoles?.map((r) => [r.userId, r]) || [])

  const now = Date.now()

  const merged = idList.map((id) => {
    const userDoc = userMap.get(id)
    const token = tokenMap.get(id)
    const roleData = roleMap.get(id)

    const { _id, tokenCreatedAt, tokenExpiresAt, ...user } = userDoc || {}

    const createdAt = token?.createdAt || tokenCreatedAt
    const expiresAt = token?.expiresAt || tokenExpiresAt
    const expiresIn = token?.expiresIn
    const expired = !token || (expiresAt && new Date(expiresAt).getTime() < now)

    return {
      userId: id,
      ...user,
      ...(createdAt ? { createdAt } : {}),
      ...(expiresAt ? { expiresAt } : {}),
      ...(expiresIn ? { expiresIn } : {}),
      expired: !!expired,
      ...(orgaRoles
        ? {
            type: roleData?.type || "",
            organizationRole: roleData ? roleData.role : null,
          }
        : {}),
    }
  })

  return merged
}

async function getApiKeyData(tokenId, regenerate = false, expiresIn) {
  try {
    const user = await getApiKeyUser(tokenId)
    if (regenerate) {
      await model.tokens.deleteAllUserTokens(tokenId)
    }

    let existingTokens = await model.tokens.getTokenByUser(tokenId)
    const auth = await generateApiKeyToken(
      user,
      regenerate ? undefined : existingTokens[0],
      expiresIn,
    )

    if (regenerate) {
      existingTokens = await model.tokens.getTokenByUser(tokenId)
    }

    const { salt, userId, ...tokenData } = existingTokens[0] || {}
    return {
      message: "API key tokens have been retrieved",
      ...tokenData,
      ...auth,
    }
  } catch (err) {
    throw err
  }
}

async function getApiKey(tokenId) {
  return getApiKeyData(tokenId)
}

async function refreshApiKey(tokenId, expiresIn) {
  return getApiKeyData(tokenId, true, expiresIn)
}

async function deleteApiKey(tokenId, revoke = false) {
  await getApiKeyUser(tokenId)
  await model.tokens.deleteAllUserTokens(tokenId)

  if (revoke === "true") {
    return { message: "API key token has been revoked" }
  }

  await model.users.delete(tokenId)
  return { message: "API key has been deleted" }
}

module.exports = {
  createApiKey,
  parseClientMetadata,
  generateApiKeyToken,
  getApiKey,
  refreshApiKey,
  deleteApiKey,
  listApiKey,
}
