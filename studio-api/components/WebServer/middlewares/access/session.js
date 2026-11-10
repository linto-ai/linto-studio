const debug = require("debug")(
  "linto:components:WebServer:middlewares:access:session",
)

const axios = require(`${process.cwd()}/lib/utility/axios`)
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

async function asOrganizationSession(req, res, next) {
  try {
    const session = await fetchLiveSession(req.params.id)
    if (!session?.id) throw new SessionNotFound()
    if (session.organizationId !== req.params.organizationId)
      throw new SessionForbidden("Session of another organization")

    req.liveSession = session
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  asOrganizationSession,
}
