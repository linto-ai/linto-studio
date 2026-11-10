const debug = require("debug")(
  "linto:components:WebServer:middlewares:access:session",
)
const crypto = require("crypto")
const jwtDecode = require("jwt-decode")

const axios = require(`${process.cwd()}/lib/utility/axios`)
const PublicToken = require(
  `${process.cwd()}/components/WebServer/config/passport/token/public_generator`,
)
const { Unauthorized } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)
const { SessionNotFound, SessionForbidden } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)

async function fetchLiveSession(sessionId) {
  const endpoint = process.env.SESSION_API_ENDPOINT
  if (!endpoint || !sessionId) return null
  try {
    return await axios.get(
      `${endpoint}/sessions/${encodeURIComponent(sessionId)}?withCaptions=false`,
    )
  } catch (err) {
    debug(`session ${sessionId} not fetched: ${err.message}`)
    return null
  }
}

function bearerToken(req) {
  const header = req?.headers?.authorization
  if (!header) return null
  const [scheme, token] = header.split(" ")
  return scheme === "Bearer" && token ? token : null
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex").slice(0, 16)
}

async function asPublicSessionToken(req, res, next) {
  try {
    const sessionId = req.params.id
    const token = bearerToken(req)
    if (!token) throw new Unauthorized("A public session token is required")

    let tokenData
    try {
      tokenData = jwtDecode(token)
    } catch (err) {
      throw new Unauthorized("Malformed public session token")
    }
    if (!tokenData?.data?.fromPublic || !tokenData?.data?.fromSession)
      throw new Unauthorized("A public session token is required")
    if (tokenData.data.fromSession !== sessionId)
      throw new SessionForbidden("Token minted for another session")
    if (!PublicToken.validateToken(token, sessionId))
      throw new Unauthorized("Invalid or expired public session token")

    const session = await fetchLiveSession(sessionId)
    if (!session?.id) throw new SessionNotFound()
    if (session.visibility !== "public")
      throw new SessionForbidden("Session is not public")

    req.payload = {
      fromPublic: true,
      data: { fromSession: sessionId, organizationId: session.organizationId },
    }
    req.liveSession = session
    req.liveSessionCaller = `public:${hashToken(token)}`
    next()
  } catch (err) {
    next(err)
  }
}

async function asOrganizationSession(req, res, next) {
  try {
    const session = await fetchLiveSession(req.params.id)
    if (!session?.id) throw new SessionNotFound()
    if (session.organizationId !== req.params.organizationId)
      throw new SessionForbidden("Session of another organization")

    req.liveSession = session
    req.liveSessionCaller = `user:${req.payload?.data?.userId}`
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  asPublicSessionToken,
  asOrganizationSession,
}
