const debug = require("debug")(
  `linto:components:WebServer:controllers:session:session`,
)
const logger = require(`${process.cwd()}/lib/logger/logger`)

const { SessionError } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)
const { Unauthorized, UnauthorizedProxy } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)

const { authFailLimiter } = require(
  `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
)

const PublicToken = require(
  `${process.cwd()}/components/WebServer/config/passport/token/public_generator`,
)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const saas = require(`${process.cwd()}/lib/saas`)
const crypto = require("crypto")

const { requireParam } = require(`${process.cwd()}/lib/utility/requireParam`)

function verifyPublicSessionPassword(storedHash, inputPassword) {
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
  if (sessionData.password && req.payload.fromPublic === true) {
    requireParam(req.query.password, Unauthorized, "Password is required for this alias")
    if (
      !verifyPublicSessionPassword(sessionData.password, req.query.password)
    ) {
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
      req.body.visibility = "user"
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

async function forwardSessionAliasPublic(req, next, res) {
  req.payload = {
    ...req.payload,
    fromPublic: true,
  }
  forwardSessionAlias(req, next, res)
}

async function forwardSessionAlias(req, next, res) {
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
    authFailLimiter(req, res, () => {
      next(err)
    })
  }
}

// SaaS admission gate for live sessions: every distinct transcriber profile
// CATEGORY (local-standard | local-gpu | external) chosen for the session must
// be allowed by the org's plan (`live.profiles` enum). The request body carries
// channels[].transcriberProfileId (an FK), so each is resolved to its
// config.type via the Session-API, then mapped to a category. FAIL-SOFT on
// resolution errors (never block a session on a transient lookup hiccup);
// throws SaasFeatureLocked (403) only when a resolved category is off-plan.
// NO-OP in the OSS build (saas disabled).
async function assertLiveProfileAllowed(req) {
  if (!saas.enabled || !saas.enabled()) return
  const orgId = req.params.organizationId
  // Guard against a malformed (truthy non-array) channels so the gate stays
  // fail-soft (a bad body should reach Session-API's 400, not 500 here).
  const channels = Array.isArray(req.body && req.body.channels)
    ? req.body.channels
    : []
  const ids = [
    ...new Set(
      channels.map((c) => c && c.transcriberProfileId).filter((v) => v != null),
    ),
  ]
  if (!orgId || ids.length === 0) return

  const categories = new Set()
  for (const id of ids) {
    try {
      const profile = await axios.get(
        process.env.SESSION_API_ENDPOINT + `/transcriber_profiles/${id}`,
      )
      const backend = profile?.config?.type || profile?.type || null
      if (!backend) continue
      // STRICT resolution for the ACCESS gate: an unmapped/unknown backend (a
      // future GPU/external engine, a typo) must NOT be treated as the cheap
      // free tier. Unknown -> most-restricted category (external => premium-only)
      // so a new paid backend is never silently runnable on free.
      const cat = saas.categoryOfStrict(backend) || "external"
      categories.add(cat)
    } catch (e) {
      // Could not resolve this profile -> don't block the session on it.
      debug("live profile resolve failed for %s: %s", id, e && e.message)
    }
  }
  // Deny if ANY chosen category is not on the plan (enforce throws on deny).
  for (const category of categories) {
    await saas.enforce({ orgId, capability: "live.profiles", value: category })
  }
}

// executeBeforeResult hook for POST /organizations/:organizationId/sessions/.
async function enforceLiveProfileAccess(req, next, res) {
  try {
    await assertLiveProfileAllowed(req)
    next()
  } catch (err) {
    next(err)
  }
}

// executeBeforeResult hook for the quickMeeting POST: gate first, then the
// existing query-param mutation (forceQueryParams calls next()).
async function enforceLiveProfileAccessQuickMeeting(req, next, res) {
  try {
    await assertLiveProfileAllowed(req)
    forceQueryParams(req, next)
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

async function generatPublicToken(jsonString, req) {
  try {
    if (!req?.payload?.data?.userId) {
      let session = JSON.parse(jsonString)

      // Include organizationId in token for WebSocket access validation
      const token = PublicToken.generateTokens(
        session.id,
        session.organizationId,
      )
      session.publicSessionToken = token
      return JSON.stringify(session)
    }
    return jsonString
  } catch (err) {
    logger.warn("Failed to generate public session token:", err)
  }
  return jsonString
}

async function filterPrivateSessions(jsonString, req) {
  try {
    if (ROLES.hasRoleAccess(req.userRole, ROLES.MEETING_MANAGER)) return jsonString

    const body = JSON.parse(jsonString)
    const sessions = body.sessions
    if (!Array.isArray(sessions)) return jsonString

    const userId = req.payload.data.userId
    body.sessions = sessions.filter(
      (session) =>
        session.visibility !== "private" || session.owner === userId,
    )
    body.totalItems = body.totalItems - (sessions.length - body.sessions.length)
    return JSON.stringify(body)
  } catch (err) {
    debug("Error filtering private sessions:", err)
    return jsonString
  }
}

async function checkSessionMatchingOrganization(req, next) {
  try {
    const session = await axios.get(
      process.env.SESSION_API_ENDPOINT + `/sessions/${req.params.id}`,
    )
    if (session?.organizationId === req.params.organizationId) return next()
    throw new Unauthorized()
  } catch (err) {
    next(err)
  }
}

function cleanPublicSessionContent(jsonString) {
  try {
    let session = JSON.parse(jsonString)
    if (session.visibility === "public") {
      session.channels.forEach((channel) => {
        if (channel.streamEndpoints) {
          delete channel.streamEndpoints
        }
      })

      return JSON.stringify(session)
    }
  } catch (error) {
    logger.warn("error on cleaning session")
    throw error
  }

  throw new UnauthorizedProxy()
}

function cleanPublicChannelContent(jsonString) {
  let channel = JSON.parse(jsonString)
  if (channel.visibility === "public") {
    delete channel.streamEndpoints
    return JSON.stringify(channel)
  }

  throw new UnauthorizedProxy()
}

module.exports = {
  forceQueryParams,
  forwardSessionAlias,
  forwardSessionAliasPublic,
  checkTranscriberProfileAccess,
  afterProxyAccess,
  generatPublicToken,
  filterPrivateSessions,
  checkSessionMatchingOrganization,
  cleanPublicSessionContent,
  cleanPublicChannelContent,
  enforceLiveProfileAccess,
  enforceLiveProfileAccessQuickMeeting,
}
