const debug = require("debug")(
  "linto:components:WebServer:controllers:llm:chatCompletions",
)

const axios = require(`${process.cwd()}/lib/utility/axios`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const { resolveServiceId } = require(
  `${process.cwd()}/components/WebServer/controllers/llm/index.js`,
)

// One request = 49 context messages + the incoming user message
const HISTORY_CONTEXT_MESSAGES = 49
const MAX_MESSAGE_CHARS = 50000
const MAX_TITLE_CHARS = 200

function gatewayUrl() {
  return process.env.LLM_GATEWAY_SERVICES?.trim()
}

function chatServiceId() {
  return process.env.LLM_CHAT_SERVICE_ID?.trim()
}

function catchupServiceId() {
  return process.env.LLM_CATCHUP_SERVICE_ID?.trim()
}

/** Default flavor of a service (id, name or route); throws on misconfiguration */
async function resolveDefaultFlavor(serviceIdentifier, { timeout } = {}) {
  const baseUrl = gatewayUrl()
  if (!baseUrl) throw new Error("LLM_GATEWAY_SERVICES not configured")
  if (!serviceIdentifier) throw new Error("Chat service not configured")

  const serviceId = await resolveServiceId(serviceIdentifier)
  const flavorsResp = await axios.get(
    `${baseUrl}/api/v1/services/${serviceId}/flavors`,
    { timeout },
  )
  const items = flavorsResp?.items || flavorsResp
  const flavors = Array.isArray(items) ? items : []

  const flavor =
    flavors.find((f) => f.is_default && f.is_active) ||
    flavors.find((f) => f.is_active)
  if (!flavor) {
    throw new Error(`No active flavor for chat service ${serviceIdentifier}`)
  }

  return flavor.id
}

function resolveChatFlavor() {
  return resolveDefaultFlavor(chatServiceId())
}

/** Dedicated catchup service first, generic chat service as fallback */
async function resolveCatchupFlavor() {
  const catchupId = catchupServiceId()
  if (catchupId) {
    try {
      return await resolveDefaultFlavor(catchupId)
    } catch (e) {
      appLogger.warn(
        `[Chat] Catchup service unavailable (${e.message}), falling back to chat service`,
      )
    }
  }
  return await resolveDefaultFlavor(chatServiceId())
}

function sseInit(res) {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()
}

function sseError(res, message) {
  res.write(`event: error\ndata: ${JSON.stringify({ error: message })}\n\n`)
}

/**
 * Relay the gateway completion stream over SSE; never calls res.end().
 * Returns { assistantContent, tokenCount }, or null on gateway error.
 */
async function streamChatCompletion(res, gatewayPayload) {
  const baseUrl = gatewayUrl()
  if (!baseUrl) {
    sseError(res, "LLM Gateway not configured")
    return null
  }

  const response = await fetch(`${baseUrl}/api/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gatewayPayload),
  })

  if (!response.ok) {
    sseError(res, "LLM service error")
    return null
  }

  let assistantContent = ""
  let tokenCount = null
  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  let buffer = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split("\n")
    buffer = lines.pop() // Keep incomplete line

    let eventType = null
    for (const line of lines) {
      if (line.startsWith("event: ")) {
        eventType = line.slice(7).trim()
      } else if (line.startsWith("data: ")) {
        const data = line.slice(6)
        try {
          const parsed = JSON.parse(data)
          if (eventType === "token" && parsed.content) {
            assistantContent += parsed.content
          }
          if (eventType === "done" && parsed.usage) {
            tokenCount = parsed.usage.total_tokens
          }
        } catch (e) {
          /* ignore parse errors */
        }

        res.write(`event: ${eventType}\ndata: ${data}\n\n`)
      }
    }
  }

  return { assistantContent, tokenCount }
}

// Mirrors thread creation: never advertise a service createSession would 503 on
async function probeService(serviceIdentifier) {
  try {
    await resolveDefaultFlavor(serviceIdentifier, { timeout: 3000 })
    return true
  } catch {
    return false
  }
}

/**
 * Shared SSE tail: stream, then persist the assistant reply and bump the
 * thread. pendingWrites (e.g. the user row) settle before the response ends.
 */
async function streamAndPersistReply(
  res,
  { chatSessionId, flavorId, gatewayPayload, pendingWrites = [] },
) {
  sseInit(res)

  if (!flavorId) {
    sseError(res, "Chat not configured: no flavor")
    res.end()
    return
  }

  const result = await streamChatCompletion(res, gatewayPayload)

  await Promise.all(pendingWrites)
  if (result?.assistantContent) {
    await Promise.all([
      model.chatMessages.create({
        sessionId: chatSessionId,
        role: "assistant",
        content: result.assistantContent,
        tokenCount: result.tokenCount,
      }),
      model.chatSessions.touch(chatSessionId),
    ])
  }

  res.end()
}

/**
 * GET /api/chat/status
 * Returns whether the chat and catchup features are usable
 */
async function chatStatus(req, res) {
  const enabled = await probeService(chatServiceId())

  // Unconfigured catchup service hides the feature even when chat works;
  // configured, `enabled` suffices (runtime fallback) and skips the probe.
  const catchupId = catchupServiceId()
  const catchupEnabled = catchupId
    ? enabled || (await probeService(catchupId))
    : false

  res.status(200).json({ enabled, catchupEnabled })
}

module.exports = {
  HISTORY_CONTEXT_MESSAGES,
  MAX_MESSAGE_CHARS,
  MAX_TITLE_CHARS,
  resolveChatFlavor,
  resolveCatchupFlavor,
  sseInit,
  sseError,
  streamChatCompletion,
  streamAndPersistReply,
  chatStatus,
}
