const debug = require("debug")(
  `linto:components:WebServer:routecontrollers:conversation:chat`,
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

const {
  HISTORY_CONTEXT_MESSAGES,
  MAX_MESSAGE_CHARS,
  MAX_TITLE_CHARS,
  resolveChatFlavor,
  sseInit,
  sseError,
  streamChatCompletion,
} = require(
  `${process.cwd()}/components/WebServer/controllers/llm/chatCompletions.js`,
)

const { ConversationNotFound } = require(
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
  const exports =
    await model.conversationExport.getByConvAndFormat(conversationId)
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
 * Load the chat session and verify ownership and conversation scoping.
 * Returns { session } on success, { status, error } otherwise. The
 * conversation-mismatch answer is a 404 on CRUD but a 403 on sendMessage.
 */
async function loadOwnedSession(
  req,
  mismatchResponse = { status: 404, error: "Chat session not found" },
) {
  const sessions = await model.chatSessions.getById(req.params.sessionId)
  if (!sessions || sessions.length === 0) {
    return { status: 404, error: "Chat session not found" }
  }

  const session = sessions[0]
  if (session.userId !== req.payload.data.userId) {
    return { status: 403, error: "Not authorized" }
  }
  if (session.conversationId !== req.params.conversationId) {
    return mismatchResponse
  }
  return { session }
}

/**
 * POST /:conversationId/chat/sessions
 * Create a new chat session
 */
async function createSession(req, res, next) {
  try {
    const { conversationId } = req.params
    const userId = req.payload.data.userId
    const organizationId =
      req.payload.organizationId ||
      req.payload.conversationOrganizationId ||
      null

    let flavorId = req.body.flavorId || null
    const title = req.body.title || "New chat"

    if (!flavorId) {
      try {
        flavorId = await resolveChatFlavor()
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
    const { conversationId } = req.params
    const userId = req.payload.data.userId

    const sessions = await model.chatSessions.getByConversationAndUser(
      conversationId,
      userId,
    )
    const counts = await model.chatMessages.countBySessions(
      sessions.map((s) => s._id.toString()),
    )

    res.status(200).json(
      sessions.map((s) => ({
        _id: s._id.toString(),
        title: s.title,
        flavorId: s.flavorId,
        messageCount: counts[s._id.toString()] || 0,
        created_at: s.created_at,
        updated_at: s.updated_at,
      })),
    )
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
    const { session, status, error } = await loadOwnedSession(req)
    if (!session) {
      return res.status(status).json({ error })
    }

    const messages = await model.chatMessages.getBySession(
      session._id.toString(),
    )

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
    const { title } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" })
    }
    if (title.trim().length > MAX_TITLE_CHARS) {
      return res.status(400).json({ error: "Title too long" })
    }

    const { session, status, error } = await loadOwnedSession(req)
    if (!session) {
      return res.status(status).json({ error })
    }

    await model.chatSessions.updateTitle(session._id.toString(), title.trim())

    res.status(200).json({ _id: session._id.toString(), title: title.trim() })
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
    const { session, status, error } = await loadOwnedSession(req)
    if (!session) {
      return res.status(status).json({ error })
    }

    await model.chatMessages.deleteBySession(session._id.toString())
    await model.chatSessions.delete(session._id.toString())

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
    if (content.trim().length > MAX_MESSAGE_CHARS) {
      return res.status(400).json({ error: "Message too long" })
    }

    // Ownership checks before any write
    const { session, status, error } = await loadOwnedSession(req, {
      status: 403,
      error: "Session does not belong to this conversation",
    })
    if (!session) {
      return res.status(status).json({ error })
    }

    const [conversations, summary, history] = await Promise.all([
      model.conversations.getById(conversationId),
      loadLatestSummary(conversationId),
      model.chatMessages.getLastBySession(sessionId, HISTORY_CONTEXT_MESSAGES),
    ])

    if (!conversations || conversations.length === 0) {
      throw new ConversationNotFound()
    }
    const conversation = conversations[0]
    const transcript = buildTranscriptText(conversation)

    const llmMessages = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: content.trim() },
    ]

    await model.chatMessages.create({
      sessionId,
      role: "user",
      content: content.trim(),
    })

    sseInit(res)

    if (!session.flavorId) {
      sseError(res, "Chat not configured: no flavor")
      res.end()
      return
    }

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
      session_id: sessionId,
      organization_id: session.organizationId || undefined,
    }

    const result = await streamChatCompletion(res, gatewayPayload)

    if (result?.assistantContent) {
      await model.chatMessages.create({
        sessionId,
        role: "assistant",
        content: result.assistantContent,
        tokenCount: result.tokenCount,
      })
      await model.chatSessions.touch(sessionId)
    }

    res.end()
  } catch (error) {
    if (res.headersSent) {
      sseError(res, "Internal error")
      res.end()
    } else {
      next(error)
    }
  }
}

module.exports = {
  createSession,
  listSessions,
  getSession,
  deleteSession,
  updateSession,
  sendMessage,
}
