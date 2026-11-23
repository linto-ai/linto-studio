const debug = require("debug")(
  "linto:components:WebServer:middlewares:access:session",
)

const axios = require(`${process.cwd()}/lib/utility/axios`)
const { SessionNotFound, SessionForbidden } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)
const { isExternalCaller } = require(`./externalEntitlement`)

async function fetchFromSessionApi(resource, id, query = "") {
  const endpoint = process.env.SESSION_API_ENDPOINT
  if (!endpoint || !id) return null
  try {
    return await axios.get(
      `${endpoint}/${resource}/${encodeURIComponent(id)}${query}`,
    )
  } catch (err) {
    debug(`${resource} ${id} not fetched: ${err.message}`)
    return null
  }
}

function fetchLiveSession(sessionId) {
  return fetchFromSessionApi("sessions", sessionId, "?withCaptions=false")
}

const fetchOwned = {
  sessions: fetchLiveSession,
  templates: (id) => fetchFromSessionApi("templates", id),
}

function asOwnedByExternalCaller(resource) {
  return async (req, res, next) => {
    try {
      if (!(await isExternalCaller(req))) return next()
      const owned = await fetchOwned[resource](req.params.id)
      if (owned?.owner !== req.payload.data.userId) throw new SessionNotFound()
      next()
    } catch (err) {
      next(err)
    }
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
  asOwnedByExternalCaller,
}
