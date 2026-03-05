const debug = require("debug")(
  `linto:components:WebServer:routecontrollers:conversation:chat`,
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

const {
  ConversationIdRequire,
  ConversationNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

/**
 * Build plain text transcript from conversation turns
 */
function buildTranscriptText(conversation) {
  if (!conversation.text) return ""
  const speakerMap = {}
  if (conversation.speakers) {
    conversation.speakers.forEach((s) => {
      speakerMap[s.speaker_id] = s.speaker_name
    })
  }
  return conversation.text
    .map((turn) => {
      const name = speakerMap[turn.speaker_id] || "Unknown"
      return `${name}: ${turn.segment}`
    })
    .join("\n")
}

/**
 * Load the latest completed summary for a conversation from LLM Gateway
 */
async function loadLatestSummary(conversationId) {
  const exports = await model.conversationExport.getByConvAndFormat(
    conversationId,
  )
  for (const exp of exports) {
    if (exp.status === "complete" && exp.jobId) {
      try {
        const baseUrl = process.env.LLM_GATEWAY_SERVICES
        if (!baseUrl) return null
        const resp = await axios.get(`${baseUrl}/api/v1/jobs/${exp.jobId}`)
        if (resp?.status === "completed" && resp?.result?.output) {
          return resp.result.output
        }
      } catch (e) {
        /* ignore */
      }
    }
  }
  return null
}

/**
 * Resolve the default flavor ID for the configured chat service
 * Throws on misconfiguration so callers can return explicit errors
 */
async function resolveDefaultChatFlavor() {
  const baseUrl = process.env.LLM_GATEWAY_SERVICES
  if (!baseUrl) throw new Error("LLM_GATEWAY_SERVICES not configured")

  const serviceId = process.env.LLM_CHAT_SERVICE_ID
  if (!serviceId) throw new Error("LLM_CHAT_SERVICE_ID not configured")

  const flavorsResp = await axios.get(
    `${baseUrl}/api/v1/services/${serviceId}/flavors`,
  )
  const flavors = flavorsResp?.items || flavorsResp || []
  if (!Array.isArray(flavors) || flavors.length === 0) {
    throw new Error(`No active flavor for chat service ${serviceId}`)
  }

  const defaultFlavor = flavors.find((f) => f.is_default && f.is_active)
  const activeFlavor = flavors.find((f) => f.is_active)
  const flavor = defaultFlavor || activeFlavor

  if (!flavor) {
    throw new Error(`No active flavor for chat service ${serviceId}`)
  }

  return flavor.id
}

/**
 * POST /:conversationId/chat/sessions
 * Create a new chat session
 */
async function createSession(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()

    const { conversationId } = req.params
    const userId = req.payload.data.userId
    const organizationId =
      req.payload.organizationId ||
      req.payload.conversationOrganizationId ||
      null

    let flavorId = req.body.flavorId || null
    const title = req.body.title || "New chat"

    // Resolve default flavor if not provided
    if (!flavorId) {
      try {
        flavorId = await resolveDefaultChatFlavor()
      } catch (e) {
        appLogger.warn(`[Chat] ${e.message}`)
        return res.status(503).json({ error: e.message })
      }
    }

    const session = {
      conversationId,
      organizationId,
      userId,
      title,
      flavorId,
    }

    const result = await model.chatSessions.create(session)
    session._id = result.insertedId.toString()

    res.status(201).json(session)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /:conversationId/chat/sessions
 * List all chat sessions for the current user on a conversation
 */
async function listSessions(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()

    const { conversationId } = req.params
    const userId = req.payload.data.userId

    const sessions = await model.chatSessions.getByConversationAndUser(
      conversationId,
      userId,
    )

    // Enrich with message count via aggregation
    const enriched = await Promise.all(
      sessions.map(async (s) => {
        const messages = await model.chatMessages.getBySession(
          s._id.toString(),
        )
        return {
          _id: s._id.toString(),
          title: s.title,
          flavorId: s.flavorId,
          messageCount: messages.length,
          created_at: s.created_at,
          updated_at: s.updated_at,
        }
      }),
    )

    res.status(200).json(enriched)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /:conversationId/chat/sessions/:sessionId
 * Get a session with all its messages
 */
async function getSession(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()

    const { sessionId } = req.params

    const sessions = await model.chatSessions.getById(sessionId)
    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ error: "Chat session not found" })
    }

    const session = sessions[0]
    if (session.userId !== req.payload.data.userId) {
      return res.status(403).json({ error: "Not authorized" })
    }
    if (session.conversationId !== req.params.conversationId) {
      return res.status(404).json({ error: "Chat session not found" })
    }
    const messages = await model.chatMessages.getBySession(sessionId)

    res.status(200).json({
      _id: session._id.toString(),
      conversationId: session.conversationId,
      title: session.title,
      flavorId: session.flavorId,
      messages: messages.map((m) => ({
        _id: m._id.toString(),
        role: m.role,
        content: m.content,
        tokenCount: m.tokenCount,
        created_at: m.created_at,
      })),
      created_at: session.created_at,
      updated_at: session.updated_at,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /:conversationId/chat/sessions/:sessionId
 * Update a session (title)
 */
async function updateSession(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()

    const { sessionId } = req.params
    const { title } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" })
    }

    const sessions = await model.chatSessions.getById(sessionId)
    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ error: "Chat session not found" })
    }

    const session = sessions[0]
    if (session.userId !== req.payload.data.userId) {
      return res.status(403).json({ error: "Not authorized" })
    }
    if (session.conversationId !== req.params.conversationId) {
      return res.status(404).json({ error: "Chat session not found" })
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ error: "Title too long" })
    }

    await model.chatSessions.updateTitle(sessionId, title.trim())

    res.status(200).json({ _id: sessionId, title: title.trim() })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /:conversationId/chat/sessions/:sessionId
 * Delete a session and all its messages
 */
async function deleteSession(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()

    const { sessionId } = req.params

    // Verify session exists and belongs to current user
    const sessions = await model.chatSessions.getById(sessionId)
    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ error: "Chat session not found" })
    }

    const session = sessions[0]
    if (session.userId !== req.payload.data.userId) {
      return res.status(403).json({ error: "Not authorized" })
    }
    if (session.conversationId !== req.params.conversationId) {
      return res.status(404).json({ error: "Chat session not found" })
    }

    // Delete messages first, then session
    await model.chatMessages.deleteBySession(sessionId)
    await model.chatSessions.delete(sessionId)

    res.status(200).json({ status: "deleted" })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /:conversationId/chat/sessions/:sessionId/messages
 * Send a user message and stream the assistant response via SSE
 */
async function sendMessage(req, res, next) {
  try {
    const { conversationId, sessionId } = req.params
    const { content } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content is required" })
    }
    if (content.trim().length > 50000) {
      return res.status(400).json({ error: "Message too long" })
    }

    // 1. Save user message
    await model.chatMessages.create({
      sessionId,
      role: "user",
      content: content.trim(),
    })

    // 2. Load all messages for session
    const allMessages = await model.chatMessages.getBySession(sessionId)
    const messages = allMessages.slice(-50) // Keep last 50 messages max
    const llmMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    // 3. Load conversation transcript
    const conversations = await model.conversations.getById(conversationId)
    if (!conversations || conversations.length === 0) {
      throw new ConversationNotFound()
    }
    const conversation = conversations[0]
    const transcript = buildTranscriptText(conversation)

    // 4. Load summary if available
    const summary = await loadLatestSummary(conversationId)

    // 5. Load session for flavorId
    const sessionRecords = await model.chatSessions.getById(sessionId)
    if (!sessionRecords || sessionRecords.length === 0) {
      return res.status(404).json({ error: "Chat session not found" })
    }
    const session = sessionRecords[0]
    if (session.userId !== req.payload.data.userId) {
      return res.status(403).json({ error: "Not authorized" })
    }
    if (session.conversationId !== conversationId) {
      return res.status(403).json({ error: "Session does not belong to this conversation" })
    }

    // 6. Guard: reject if session has no flavor configured
    if (!session.flavorId) {
      res.setHeader("Content-Type", "text/event-stream")
      res.setHeader("Cache-Control", "no-cache")
      res.setHeader("Connection", "keep-alive")
      res.flushHeaders()
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: "Chat not configured: no flavor" })}\n\n`,
      )
      res.end()
      return
    }

    // 7. Build LLM Gateway request
    const gatewayPayload = {
      flavor_id: session.flavorId,
      messages: llmMessages,
      context: {
        transcript,
        summary: summary || undefined,
        metadata: {
          conversation_name: conversation.name,
        },
      },
    }

    // 8. SSE headers
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders()

    // 9. POST to LLM Gateway with streaming
    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: "LLM Gateway not configured" })}\n\n`,
      )
      res.end()
      return
    }

    const response = await fetch(`${baseUrl}/api/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gatewayPayload),
    })

    if (!response.ok) {
      const errMsg = "LLM service error"
      try {
        await response.text()
      } catch (e) {
        /* ignore */
      }
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: errMsg })}\n\n`,
      )
      res.end()
      return
    }

    // 9. Pipe response while accumulating content
    let assistantContent = ""
    let tokenCount = null
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    let buffer = ""
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Parse SSE events from buffer
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

          // Forward to client
          res.write(`event: ${eventType}\ndata: ${data}\n\n`)
        }
      }
    }

    // 10. Save assistant message
    if (assistantContent) {
      await model.chatMessages.create({
        sessionId,
        role: "assistant",
        content: assistantContent,
        tokenCount,
      })

      // Update session timestamp
      await model.chatSessions.updateTitle(sessionId, session.title)
    }

    res.end()
  } catch (error) {
    // If headers already sent, write error as SSE
    if (res.headersSent) {
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: "Internal error" })}\n\n`,
      )
      res.end()
    } else {
      next(error)
    }
  }
}

/**
 * GET /api/chat/status
 * Returns whether the chat feature is configured and the chat service is active
 */
async function chatStatus(req, res) {
  const gatewayUrl = process.env.LLM_GATEWAY_SERVICES?.trim()
  const chatServiceId = process.env.LLM_CHAT_SERVICE_ID?.trim()

  if (!gatewayUrl || !chatServiceId) {
    return res.status(200).json({ enabled: false })
  }

  try {
    const response = await axios.get(
      `${gatewayUrl}/api/v1/services/${chatServiceId}`,
      { timeout: 3000 },
    )
    const serviceActive = response?.is_active !== false
    const hasActiveFlavor = (response?.flavors || []).some(
      (f) => f.is_active !== false,
    )
    res.status(200).json({ enabled: serviceActive && hasActiveFlavor })
  } catch {
    // Gateway unreachable or service not found — disable chat
    res.status(200).json({ enabled: false })
  }
}

module.exports = {
  createSession,
  listSessions,
  getSession,
  deleteSession,
  updateSession,
  sendMessage,
  chatStatus,
}
