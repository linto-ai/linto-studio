const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:session:catchup",
)

const crypto = require("crypto")

const axios = require(`${process.cwd()}/lib/utility/axios`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const PublicToken = require(
  `${process.cwd()}/components/WebServer/config/passport/token/public_generator`,
)
const { verifyAuthToken } = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
const { initCaptionsForConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
)
const { buildTranscriptText } = require(
  `${process.cwd()}/lib/utility/buildTranscriptText`,
)
const { resolveServiceId, resolveFlavorId } = require(
  `${process.cwd()}/components/WebServer/controllers/llm/index.js`,
)

const jwtDecode = require("jwt-decode")

const TYPES = require(`${process.cwd()}/lib/dao/conversation/types`)

const DEFAULT_CHANNEL_INDEX = 0
const DEFAULT_MAX_CHARS = 12000
const MIN_TRANSCRIPT_CHARS = 200
const CACHE_TTL_MS = 60 * 1000
const RATE_LIMIT_WINDOW_MS = 20 * 1000
const BEFORE_BUCKET_MS = 30 * 1000
const MAX_TOKENS = 400
const STREAM_IDLE_TIMEOUT_MS = 60 * 1000
const DEFAULT_CATCHUP_SERVICE = "visio-catchup"
const USER_PROMPT = "Résume-moi ce qui a été dit avant mon arrivée."

const summaryCache = new Map()
const rateLimiter = new Map()

function pruneExpired(now = Date.now()) {
  for (const [key, entry] of summaryCache) {
    if (entry.expiresAt <= now) summaryCache.delete(key)
  }
  for (const [key, ts] of rateLimiter) {
    if (now - ts > RATE_LIMIT_WINDOW_MS) rateLimiter.delete(key)
  }
}

function resetCatchupState() {
  summaryCache.clear()
  rateLimiter.clear()
}

function extractBearer(req) {
  const header = req?.headers?.authorization
  if (!header) return null
  const parts = header.split(" ")
  return (parts.length > 1 ? parts[1] : parts[0]) || null
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex").slice(0, 16)
}

async function authorize(req, sessionId, session) {
  const token = extractBearer(req)
  if (!token) return { ok: false, status: 401, code: "catchup_unauthorized" }

  let tokenData = null
  try {
    tokenData = jwtDecode(token + "")
  } catch (err) {
    return { ok: false, status: 401, code: "catchup_unauthorized" }
  }

  if (tokenData?.data?.fromPublic && tokenData?.data?.fromSession) {
    if (tokenData.data.fromSession !== sessionId)
      return { ok: false, status: 403, code: "catchup_forbidden" }
    const valid = PublicToken.validateToken(token, sessionId)
    if (!valid) return { ok: false, status: 401, code: "catchup_unauthorized" }
    if (session?.visibility !== "public")
      return { ok: false, status: 403, code: "catchup_forbidden" }
    return { ok: true, callerId: `public:${hashToken(token)}` }
  }

  const userData = await verifyAuthToken(token)
  if (!userData?.userId)
    return { ok: false, status: 401, code: "catchup_unauthorized" }

  const isMember = await isOrganizationMember(
    session?.organizationId,
    userData.userId,
  )
  if (!isMember) return { ok: false, status: 403, code: "catchup_forbidden" }

  return { ok: true, callerId: `user:${userData.userId}` }
}

async function isOrganizationMember(organizationId, userId) {
  if (!organizationId || !userId) return false
  try {
    const organizations = await model.organizations.getById(
      organizationId.toString(),
    )
    if (!organizations || organizations.length !== 1) return false
    return (organizations[0].users || []).some(
      (user) => user.userId?.toString() === userId.toString(),
    )
  } catch (err) {
    debug(`organization membership check failed: ${err.message}`)
    return false
  }
}

async function fetchSession(sessionId) {
  const endpoint = process.env.SESSION_API_ENDPOINT
  if (!endpoint) return null
  try {
    return await axios.get(`${endpoint}/sessions/${sessionId}`)
  } catch (err) {
    debug(`session ${sessionId} not fetched: ${err.message}`)
    return null
  }
}

function pickChannel(session, channelIndex) {
  const channels = [...(session?.channels || [])].sort((a, b) => a.id - b.id)
  return channels[channelIndex] || null
}

function captionTimeMs(caption) {
  const astart = Date.parse(caption?.astart)
  if (Number.isNaN(astart)) return null
  return astart + (Number(caption?.start) || 0) * 1000
}

function filterCaptionsBefore(closedCaptions, beforeMs) {
  if (!Array.isArray(closedCaptions)) return []
  if (!beforeMs) return closedCaptions
  return closedCaptions.filter((caption) => {
    const at = captionTimeMs(caption)
    return at === null ? true : at < beforeMs
  })
}

function capTranscript(text, maxChars) {
  if (!text || text.length <= maxChars) return text || ""
  const lines = text.split("\n")
  while (lines.length > 1 && lines.join("\n").length > maxChars) lines.shift()
  const capped = lines.join("\n")
  return capped.length > maxChars
    ? capped.slice(capped.length - maxChars)
    : capped
}

async function buildCatchupTranscript(session, channel, captions) {
  const singleChannelSession = {
    ...session,
    channels: [{ ...channel, keepAudio: false, closedCaptions: captions }],
  }
  const conversations = await initCaptionsForConversation(
    singleChannelSession,
    session.name,
  )
  const canonical = (conversations || []).find(
    (conv) => conv?.type?.mode !== TYPES.TRANSLATION,
  )
  if (!canonical) return ""
  return buildTranscriptText(canonical, " : ")
}

async function resolveCatchupFlavor() {
  const baseUrl = process.env.LLM_GATEWAY_SERVICES?.trim()
  if (!baseUrl) return null

  const candidates = []
  const route = (process.env.LLM_CATCHUP_SERVICE || DEFAULT_CATCHUP_SERVICE)
    .toString()
    .trim()
  if (route) candidates.push(route)
  const fallback = process.env.LLM_CHAT_SERVICE_ID?.trim()
  if (fallback && fallback !== route) candidates.push(fallback)

  for (const candidate of candidates) {
    try {
      const serviceId = await resolveServiceId(candidate)
      if (!serviceId) continue
      const flavorId = await resolveFlavorId(serviceId)
      if (flavorId) return { serviceId, flavorId }
    } catch (err) {
      debug(`catchup service ${candidate} not resolvable: ${err.message}`)
    }
  }
  return null
}

function openSSE(res) {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  if (typeof res.flushHeaders === "function") res.flushHeaders()
}

function writeEvent(res, event, payload) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`)
}

async function catchUp(req, res, next) {
  try {
    const sessionId = req.params.id
    const body = req.body || {}
    const channelIndex = Number.isInteger(body.channelIndex)
      ? body.channelIndex
      : DEFAULT_CHANNEL_INDEX
    const maxChars =
      Number.isFinite(body.maxChars) && body.maxChars > 0
        ? Math.floor(body.maxChars)
        : DEFAULT_MAX_CHARS
    const beforeMs = body.before ? Date.parse(body.before) : null
    const before = Number.isNaN(beforeMs) ? null : beforeMs

    const session = await fetchSession(sessionId)
    if (!session || !session.id)
      return res.status(404).json({ code: "session_not_found" })

    const auth = await authorize(req, sessionId, session)
    if (!auth.ok) return res.status(auth.status).json({ code: auth.code })

    pruneExpired()

    const rateKey = `${sessionId}:${auth.callerId}`
    const last = rateLimiter.get(rateKey)
    const now = Date.now()
    if (last && now - last < RATE_LIMIT_WINDOW_MS)
      return res.status(429).json({ code: "catchup_rate_limited" })
    rateLimiter.set(rateKey, now)

    const channel = pickChannel(session, channelIndex)
    if (!channel) return res.status(204).end()

    const captions = filterCaptionsBefore(channel.closedCaptions, before)
    if (captions.length === 0) return res.status(204).end()

    const rawTranscript = await buildCatchupTranscript(
      session,
      channel,
      captions,
    )
    const transcript = capTranscript(rawTranscript, maxChars)
    if (!transcript || transcript.length < MIN_TRANSCRIPT_CHARS)
      return res.status(204).end()

    const lastSegmentId = captions[captions.length - 1]?.segmentId ?? "none"
    const beforeBucket = before ? Math.floor(before / BEFORE_BUCKET_MS) : 0
    const cacheKey = `${sessionId}:${channelIndex}:${lastSegmentId}:${beforeBucket}`

    const cached = summaryCache.get(cacheKey)
    if (cached && cached.expiresAt > now) {
      openSSE(res)
      writeEvent(res, "token", { content: cached.text })
      writeEvent(res, "done", { cached: true })
      return res.end()
    }

    const flavor = await resolveCatchupFlavor()
    if (!flavor) return res.status(503).json({ code: "catchup_unavailable" })

    const baseUrl = process.env.LLM_GATEWAY_SERVICES?.trim()
    const gatewayPayload = {
      flavor_id: flavor.flavorId,
      messages: [{ role: "user", content: USER_PROMPT }],
      context: {
        transcript,
        metadata: { conversation_name: session.name },
      },
      max_tokens: MAX_TOKENS,
      session_id: sessionId,
      organization_id: session.organizationId || undefined,
    }

    const upstream = new AbortController()
    let timedOut = false
    let clientGone = false
    let idleTimer = null
    const armIdleTimer = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        timedOut = true
        upstream.abort()
      }, STREAM_IDLE_TIMEOUT_MS)
    }
    const onClientClose = () => {
      if (res.writableEnded) return
      clientGone = true
      upstream.abort()
    }
    if (typeof res.on === "function") res.on("close", onClientClose)

    try {
      armIdleTimer()
      let response
      try {
        response = await fetch(`${baseUrl}/api/v1/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gatewayPayload),
          signal: upstream.signal,
        })
      } catch (err) {
        const reason = timedOut ? "gateway timed out" : "gateway unreachable"
        appLogger.warn(`[Catchup] ${reason}: ${err.message}`)
        return res.status(503).json({ code: "catchup_unavailable" })
      }

      if (!response || !response.ok || !response.body) {
        appLogger.warn(`[Catchup] gateway error ${response?.status}`)
        return res.status(503).json({ code: "catchup_unavailable" })
      }

      openSSE(res)

      let full = ""
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let eventType = null

      try {
        while (true) {
          armIdleTimer()
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop()
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7).trim()
              continue
            }
            if (!line.startsWith("data: ")) continue
            const data = line.slice(6)
            let parsed = null
            try {
              parsed = JSON.parse(data)
            } catch (err) {}
            if (eventType === "token" && parsed?.content) {
              full += parsed.content
              writeEvent(res, "token", { content: parsed.content })
            } else if (eventType === "error") {
              const message =
                parsed?.message || parsed?.error || "LLM service error"
              appLogger.warn(`[Catchup] gateway stream error: ${message}`)
              writeEvent(res, "error", { message })
              return res.end()
            }
          }
        }
      } catch (err) {
        if (clientGone) return res.end()
        const message = timedOut
          ? "LLM stream timed out"
          : "LLM stream interrupted"
        appLogger.warn(`[Catchup] ${message}: ${err.message}`)
        writeEvent(res, "error", { message })
        return res.end()
      }

      if (full) {
        summaryCache.set(cacheKey, {
          text: full,
          expiresAt: Date.now() + CACHE_TTL_MS,
        })
      }
      writeEvent(res, "done", { cached: false })
      return res.end()
    } finally {
      clearTimeout(idleTimer)
      if (typeof res.removeListener === "function")
        res.removeListener("close", onClientClose)
      upstream.abort()
    }
  } catch (error) {
    if (res.headersSent) {
      writeEvent(res, "error", { message: "Internal error" })
      return res.end()
    }
    return next(error)
  }
}

async function catchUpStatus(req, res, next) {
  try {
    const sessionId = req.params.id
    const session = await fetchSession(sessionId)
    if (!session || !session.id)
      return res.status(404).json({ code: "session_not_found" })

    const auth = await authorize(req, sessionId, session)
    if (!auth.ok) return res.status(auth.status).json({ code: auth.code })

    const flavor = await resolveCatchupFlavor()
    return res.status(200).json({ enabled: !!flavor })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  catchUp,
  catchUpStatus,
  resetCatchupState,
  capTranscript,
  filterCaptionsBefore,
  pickChannel,
  resolveCatchupFlavor,
}
