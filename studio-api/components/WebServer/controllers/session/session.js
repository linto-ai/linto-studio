const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:session:sessions`,
)
const { SessionError } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

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

async function forwardSessionAlias(req, next) {
  try {
    const uuidV4Pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    // If req.params.id matches the UUID v4 pattern, we skip
    if (uuidV4Pattern.test(req.params.id)) {
      next()
    } else if (req.params.id) {
      const existingSession = await model.sessionAlias.getByName(req.params.id)

      if (existingSession.length > 0) {
        req.url = req.url.replace(req.params.id, existingSession[0].sessionId)
        req.params.id = existingSession[0].sessionId
      }

      next()
    }
  } catch (err) {
    next(err)
  }
}

async function removeTranscriberProfileData(jsonString, req) {
  try {
    const parsed = JSON.parse(jsonString)
    const isArray = Array.isArray(parsed)

    const cleaned = (isArray ? parsed : [parsed]).map((session) => {
      const sessionCopy = { ...session }
      if (sessionCopy.config && sessionCopy.config.key) {
        delete sessionCopy.config.key
      }
      return sessionCopy
    })

    return JSON.stringify(isArray ? cleaned : cleaned[0])
  } catch (err) {
    return jsonString // fallback: return original string on error
  }
}

async function checkTranscriberProfileAccess(jsonString, req) {
  try {
    const transcribers = JSON.parse(jsonString)
    const filtered = transcribers
      .filter(
        (session) =>
          session.organizationId === req.params.organizationId ||
          session.organizationId === null,
      )
      .map((session) => {
        const sessionCopy = { ...session }
        if (sessionCopy.config && sessionCopy.config.key) {
          delete sessionCopy.config.key
        }

        return sessionCopy
      })
    return JSON.stringify(filtered)
  } catch (err) {
    return jsonString
  }
}

module.exports = {
  forceQueryParams,
  forwardSessionAlias,
  removeTranscriberProfileData,
  checkTranscriberProfileAccess,
}
