const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:session:sessions`,
)
const { SessionError } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)
const { Unauthorized } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const crypto = require("crypto")

function verifyPassword(storedHash, inputPassword) {
  const inputKey = crypto.pbkdf2Sync(
    inputPassword,
    process.env.SESSION_PSW_SALT,
    100000,
    64,
    "sha512",
  )
  return crypto.timingSafeEqual(Buffer.from(storedHash, "hex"), inputKey)
}

function ensurePasswordIfNeeded(sessionData, req) {
  if (sessionData.password && req.payload.public === true) {
    if (!req.query.password) {
      throw new Unauthorized("Password is required for this alias")
    }
    if (!verifyPassword(sessionData.password, req.query.password)) {
      throw new Unauthorized("Invalid password")
    }
  }
}

async function afterProxyAccess(jsonString, req) {
  try {
    const session = JSON.parse(jsonString)
    if (session.organizationId === req.params.organizationId) return jsonString
    throw new Unauthorized()
  } catch (err) {
    throw err
  }
}

async function forceQueryParams(req, next) {
  try {
    if (req.body && Object.keys(req.body).length !== 0) {
      req.body.name = "@" + req.payload.data.userId
      req.body.visibility = "private"
      req.query.organizationId = req.params.organizationId || ""

      if (req.body.channel && req.body.channels.length === 1)
        throw new SessionError("Channel is required")
    } else {
      req.query.searchName = "@" + req.payload.data.userId || ""
      req.query.organizationId = req.params.organizationId || ""
    }

    next()
  } catch (err) {
    next(err)
  }
}

async function forwardSessionAliasPublic(req, next) {
  req.payload = {
    ...req.payload,
    public: true,
  }
  forwardSessionAlias(req, next)
}

async function forwardSessionAlias(req, next) {
  try {
    const uuidV4Pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    // User is accessing a session by its ID
    if (uuidV4Pattern.test(req.params.id)) {
      const existingSession = await model.sessionData.getBySessionId(
        req.params.id,
      )

      if (existingSession.length === 0) {
        next()
      } else {
        ensurePasswordIfNeeded(existingSession[0], req)
        next()
      }
    } else if (req.params.id) {
      const existingSession = await model.sessionData.getByName(req.params.id)

      if (existingSession.length > 0) {
        req.url = req.url.replace(req.params.id, existingSession[0].sessionId)
        req.params.id = existingSession[0].sessionId
        ensurePasswordIfNeeded(existingSession[0], req)
      }

      next()
    }
  } catch (err) {
    next(err)
  }
}

async function checkTranscriberProfileAccess(jsonString, req) {
  try {
    const transcribers = JSON.parse(jsonString)
    const filtered = transcribers.filter(
      (session) =>
        session.organizationId === req.params.organizationId ||
        session.organizationId === null,
    )
    return JSON.stringify(filtered)
  } catch (err) {
    return jsonString
  }
}

module.exports = {
  forceQueryParams,
  forwardSessionAlias,
  forwardSessionAliasPublic,
  checkTranscriberProfileAccess,
  afterProxyAccess,
}
