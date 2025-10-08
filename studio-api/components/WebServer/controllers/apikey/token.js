const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:organizations:token",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const ms = require("ms")
const TokenGenerator = require(
  `${process.cwd()}/components/WebServer/config/passport/token/generator`,
)
const { UserError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const PLATFORM_ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)

function getExpiresIn(value, defaultValue = "7d") {
  if (value === undefined) return process.env.EXTENDED_TOKEN_DAYS_TIME || "7d"

  if (!isNaN(value) && Number(value) > 0) {
    return Number(value)
  }

  try {
    const duration = ms(value)
    if (typeof duration === "number" && duration > 0) {
      return value
    }
  } catch {}
  return defaultValue
}

async function generateApiKeyToken(
  userId,
  token,
  expires_in = process.env.EXTENDED_TOKEN_DAYS_TIME,
) {
  try {
    const user = await model.users.getById(userId, true)
    if (user.length !== 1) throw new UserNotFound()

    expires_in = getExpiresIn(expires_in)
    if (token === undefined) {
      token_salt = require("randomstring").generate(12)
      token = await model.tokens.insert(user[0]._id, token_salt, expires_in)
    } else {
      token_salt = token.salt
    }

    let tokenData = {
      salt: token_salt,
      tokenId: token.insertedId || token._id.toString(),
      userId: user[0]._id,
      role: user[0].role,
    }

    return TokenGenerator(tokenData, {
      expires_in: token.expiresIn || expires_in,
    })
  } catch (error) {
    throw error
  }
}

async function createApiKey(reqPayload, role = PLATFORM_ROLE.UNDEFINED) {
  try {
    const { body, payload, params } = reqPayload
    let clientMetadata = {}
    if (body.metadata) {
      try {
        const parsed = JSON.parse(body.metadata)

        if (typeof parsed === "object" && parsed !== null) {
          clientMetadata = parsed
        }
      } catch {}
    }

    const metadata = {
      ...clientMetadata,
      createdBy: payload.data.userId,
      organizationId: params.organizationId,
    }
    const userPayload = {
      firstname: body.name || "API Key",
      lastname: "",
      metadata,
    }
    const createdUser = await model.users.createApiKey(userPayload, role)
    if (createdUser.insertedCount !== 1) throw new UserError()

    return await generateApiKeyToken(
      createdUser.insertedId.toString(),
      undefined,
      body.expires_in,
    )
  } catch (err) {
    throw err
  }
}

async function getApiKey(tokenId) {
  const tokens = await model.tokens.getTokenByUser(tokenId)

  return {
    message: "API key tokens has been retrieved",
    ...(await generateApiKeyToken(tokenId, tokens[0])),
  }
}

async function refreshApiKey(tokenId, expiresIn) {
  await model.tokens.deleteAllUserTokens(tokenId)

  return {
    message: "API key token has been refreshed",
    ...(await generateApiKeyToken(tokenId, undefined, expiresIn)),
  }
}

async function deleteApiKey(tokenId, revoke = false) {
  await model.tokens.deleteAllUserTokens(tokenId)

  if (revoke === "true") {
    return { message: "API key token has been revoked" }
  }

  await model.users.delete(tokenId)
  return { message: "API key has been deleted" }
}

module.exports = {
  createApiKey,
  generateApiKeyToken,
  getApiKey,
  refreshApiKey,
  deleteApiKey,
}
