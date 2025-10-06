const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:organizations:m2m",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const ms = require("ms")
const TokenGenerator = require(
  `${process.cwd()}/components/WebServer/config/passport/token/generator`,
)
const { UserError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
// const ORGA_ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
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

async function generateM2MToken(
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

async function createM2MUser(reqPayload, role = PLATFORM_ROLE.UNDEFINED) {
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
      firstname: body.name,
      metadata,
    }
    const createdUser = await model.users.createM2MUser(userPayload, role)
    if (createdUser.insertedCount !== 1) throw new UserError()

    return await generateM2MToken(
      createdUser.insertedId.toString(),
      undefined,
      body.expires_in,
    )
  } catch (err) {
    throw err
  }
}

async function getM2MTokens(tokenId) {
  const tokens = await model.tokens.getTokenByUser(tokenId)

  return {
    message: "M2M tokens have been retrieved",
    ...(await generateM2MToken(tokenId, tokens[0])),
  }
}

async function refreshM2MToken(tokenId, expiresIn) {
  await model.tokens.deleteAllUserTokens(tokenId)

  return {
    message: "M2M token has been refreshed",
    ...(await generateM2MToken(tokenId, undefined, expiresIn)),
  }
}

async function deleteM2Token(tokenId, revoke = false) {
  await model.tokens.deleteAllUserTokens(tokenId)

  if (revoke === "true") {
    return { message: "M2M token has been revoked" }
  }

  await model.users.delete(tokenId)
  return { message: "M2M token has been deleted" }
}

module.exports = {
  createM2MUser,
  generateM2MToken,
  getM2MTokens,
  refreshM2MToken,
  deleteM2Token,
}
