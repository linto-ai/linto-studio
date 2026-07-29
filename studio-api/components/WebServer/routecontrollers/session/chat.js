const debug = require(`debug`)(
  `linto:components:WebServer:routecontrollers:session:chat`,
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

const {
  HISTORY_CONTEXT_MESSAGES,
  MAX_MESSAGE_CHARS,
  MAX_TITLE_CHARS,
  resolveCatchupFlavor,
  sseInit,
  sseError,
  streamChatCompletion,
} = require(
  `${process.cwd()}/components/WebServer/controllers/llm/chatCompletions.js`,
)
const { dedupeClosedCaptionsBySegmentId } = require(
  `${process.cwd()}/components/WebServer/controllers/session/channelCaptions.js`,
)

const CAPTIONS_FETCH_LIMIT = 500
const TRANSCRIPT_MAX_CHARS = 150000
// "user" visibility = quick meeting, owner-only like "private"
const OWNER_ONLY_VISIBILITIES = ["private", "user"]
const DEFAULT_CATCHUP_MESSAGE = "Catch me up on what has been said so far."

async function fetchLiveSession(sessionId) {
  try {
    return await axios.get(
      `${process.env.SESSION_API_ENDPOINT}/sessions/${sessionId}?withCaptions=false`,
    )
  } catch (err) {
    if (err.response?.status === 404) return null
    throw err
  }
}

/**
 * Fetch the latest captions of a channel (reverse pagination: offset=0 is
 * the latest turns, chronological order within the page)
 */
async function fetchChannelCaptions(sessionId, channelId, limit) {
  try {
    const channel = await axios.get(
      `${process.env.SESSION_API_ENDPOINT}/sessions/${sessionId}/channels/${channelId}?limit=${limit}&offset=0`,
    )
    return channel?.closedCaptions || []
  } catch (err) {
    if (err.response?.status === 404) return []
    throw err
  }
}

function hasLiveSessionAccess(liveSession, req) {
  const organizationId = req.params.organizationId
  if (
    !liveSession.organizationId ||
    liveSession.organizationId.toString() !== organizationId.toString()
  ) {
    return false
  }
  if (OWNER_ONLY_VISIBILITIES.includes(liveSession.visibility)) {
    return liveSession.owner === req.payload.data.userId
  }
  return true
}

/**
 * Load the chat thread and verify ownership and scoping.
 * Returns null on any mismatch so callers answer a uniform 404.
 */
async function loadOwnedThread(req) {
  const { sessionId, chatSessionId, organizationId } = req.params
  const threads = await model.chatSessions.getById(chatSessionId)
  if (!threads || threads.length === 0) return null

  const thread = threads[0]
  if (thread.userId !== req.payload.data.userId) return null
  if (thread.liveSessionId !== sessionId) return null
  if (thread.organizationId !== organizationId) return null
  return thread
}

function minutesBetween(startMs, endMs) {
  return Math.max(0, Math.round((endMs - startMs) / 60000))
}

function findChannel(liveSession, channelId) {
  const channels = liveSession.channels || []
  if (channelId !== null && channelId !== undefined) {
    return channels.find((c) => c.id.toString() === channelId.toString())
  }
  if (channels.length === 1) return channels[0]
  return null
}

function buildSessionTranscript(captions, sessionStartTime) {
  const deduped = dedupeClosedCaptionsBySegmentId(captions)
  const startMs = sessionStartTime ? new Date(sessionStartTime).getTime() : null

  const lines = []
  for (const caption of deduped) {
    if (caption.locutor === "bot") continue
    if (!caption.text) continue

    const speaker = caption.locutor || "Unknown speaker"
    let prefix = ""
    if (startMs && caption.astart) {
      const minutes = minutesBetween(
        startMs,
        new Date(caption.astart).getTime(),
      )
      prefix = `[+${minutes}min] `
    }
    lines.push(`${prefix}${speaker}: ${caption.text}`)
  }

  // Keep the most recent lines that fit within the size budget
  let total = 0
  let firstKept = lines.length
  for (let i = lines.length - 1; i >= 0; i--) {
    total += lines[i].length + 1
    if (total > TRANSCRIPT_MAX_CHARS) break
    firstKept = i
  }

  return lines.slice(firstKept).join("\n")
}

/**
 * Briefing prompt sent in place of the user's catchup message. Redundant
 * with the dedicated gateway service's system prompt on purpose: it keeps
 * the briefing structured when falling back to the generic chat service.
 */
function buildCatchupPrompt(liveSession, lang) {
  const startMs = liveSession.startTime
    ? new Date(liveSession.startTime).getTime()
    : null
  const started = startMs
    ? ` (started ${minutesBetween(startMs, Date.now())} minutes ago)`
    : ""
  const langLine = lang
    ? `Write the briefing in ${lang}.`
    : "Write the briefing in the main language of the transcript."

  return [
    `You are briefing a participant who just joined the live meeting "${liveSession.name}" already in progress${started}.`,
    "Using the transcript provided in context, write a quick catch-up briefing readable in under 30 seconds, with these sections:",
    "- Context: meeting topic and speakers present so far",
    "- Topics covered: main points in chronological order, mentioning who said what on key points",
    "- Decisions made: what has been agreed or settled",
    "- Happening now: the topic under discussion at the end of the transcript",
    "Be factual and concise, use short bullet points. Skip a section when the transcript gives no information for it.",
    langLine,
  ].join("\n")
}

/**
 * POST /:sessionId/chat/sessions
 * Create a new chat thread on a live session
 */
async function createSession(req, res, next) {
  try {
    const { sessionId, organizationId } = req.params
    const userId = req.payload.data.userId

    const liveSession = await fetchLiveSession(sessionId)
    if (!liveSession) {
      return res.status(404).json({ error: "Session not found" })
    }
    if (!hasLiveSessionAccess(liveSession, req)) {
      return res.status(403).json({ error: "Not authorized" })
    }

    const channel = findChannel(liveSession, req.body.channelId ?? null)
    if (!channel) {
      return res.status(400).json({ error: "Unknown channel" })
    }

    let flavorId
    try {
      flavorId = await resolveCatchupFlavor()
    } catch (e) {
      appLogger.warn(`[Chat] ${e.message}`)
      return res.status(503).json({ error: e.message })
    }

    const chatSession = {
      liveSessionId: sessionId,
      channelId: channel.id,
      organizationId,
      userId,
      title: req.body.title || "New chat",
      flavorId,
    }

    const result = await model.chatSessions.create(chatSession)
    chatSession._id = result.insertedId.toString()

    res.status(201).json(chatSession)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /:sessionId/chat/sessions
 * List the current user's chat threads on a live session
 */
async function listSessions(req, res, next) {
  try {
    const { sessionId, organizationId } = req.params
    const userId = req.payload.data.userId

    const sessions = await model.chatSessions.getByLiveSessionAndUser(
      sessionId,
      userId,
      organizationId,
    )
    const counts = await model.chatMessages.countBySessions(
      sessions.map((s) => s._id.toString()),
    )

    res.status(200).json(
      sessions.map((s) => ({
        _id: s._id.toString(),
        title: s.title,
        flavorId: s.flavorId,
        channelId: s.channelId,
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
 * GET /:sessionId/chat/sessions/:chatSessionId
 * Get a chat thread with all its messages
 */
async function getSession(req, res, next) {
  try {
    const thread = await loadOwnedThread(req)
    if (!thread) {
      return res.status(404).json({ error: "Chat session not found" })
    }

    const messages = await model.chatMessages.getBySession(
      thread._id.toString(),
    )

    res.status(200).json({
      _id: thread._id.toString(),
      liveSessionId: thread.liveSessionId,
      channelId: thread.channelId,
      title: thread.title,
      flavorId: thread.flavorId,
      messages: messages.map((m) => ({
        _id: m._id.toString(),
        role: m.role,
        content: m.content,
        tokenCount: m.tokenCount,
        created_at: m.created_at,
      })),
      created_at: thread.created_at,
      updated_at: thread.updated_at,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /:sessionId/chat/sessions/:chatSessionId
 * Update a chat thread (title)
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

    const thread = await loadOwnedThread(req)
    if (!thread) {
      return res.status(404).json({ error: "Chat session not found" })
    }

    await model.chatSessions.updateTitle(thread._id.toString(), title.trim())

    res.status(200).json({ _id: thread._id.toString(), title: title.trim() })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /:sessionId/chat/sessions/:chatSessionId
 * Delete a chat thread and all its messages
 */
async function deleteSession(req, res, next) {
  try {
    const thread = await loadOwnedThread(req)
    if (!thread) {
      return res.status(404).json({ error: "Chat session not found" })
    }

    await model.chatMessages.deleteBySession(thread._id.toString())
    await model.chatSessions.delete(thread._id.toString())

    res.status(200).json({ status: "deleted" })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /:sessionId/chat/sessions/:chatSessionId/messages
 * Send a user message (or a catchup request) and stream the assistant
 * response via SSE
 */
async function sendMessage(req, res, next) {
  try {
    const { sessionId, chatSessionId } = req.params
    const { content, mode, lang } = req.body
    const isCatchup = mode === "catchup"

    if (!isCatchup && (!content || !content.trim())) {
      return res.status(400).json({ error: "Message content is required" })
    }
    if (content && content.trim().length > MAX_MESSAGE_CHARS) {
      return res.status(400).json({ error: "Message too long" })
    }

    const [thread, liveSession, history] = await Promise.all([
      loadOwnedThread(req),
      fetchLiveSession(sessionId),
      model.chatMessages.getLastBySession(
        chatSessionId,
        HISTORY_CONTEXT_MESSAGES,
      ),
    ])
    if (!thread) {
      return res.status(404).json({ error: "Chat session not found" })
    }
    if (!liveSession) {
      return res.status(404).json({ error: "Session not found" })
    }
    if (!hasLiveSessionAccess(liveSession, req)) {
      return res.status(403).json({ error: "Not authorized" })
    }

    const channel = findChannel(liveSession, thread.channelId)
    if (!channel) {
      return res.status(400).json({ error: "Unknown channel" })
    }

    const captions = await fetchChannelCaptions(
      sessionId,
      channel.id,
      CAPTIONS_FETCH_LIMIT,
    )

    // The full catchup prompt is sent to the LLM but never stored nor shown:
    // the thread keeps the short message the user actually sent
    const displayContent =
      content && content.trim() ? content.trim() : DEFAULT_CATCHUP_MESSAGE
    const outgoingContent = isCatchup
      ? buildCatchupPrompt(liveSession, lang)
      : displayContent

    const llmMessages = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: outgoingContent },
    ]

    await model.chatMessages.create({
      sessionId: chatSessionId,
      role: "user",
      content: displayContent,
    })

    sseInit(res)

    if (!thread.flavorId) {
      sseError(res, "Chat not configured: no flavor")
      res.end()
      return
    }

    const transcript = buildSessionTranscript(captions, liveSession.startTime)

    const gatewayPayload = {
      flavor_id: thread.flavorId,
      messages: llmMessages,
      context: {
        transcript,
        metadata: {
          conversation_name: liveSession.name,
          session_status: liveSession.status,
          channel_name: channel.name,
        },
      },
      session_id: chatSessionId,
      organization_id: thread.organizationId || undefined,
    }

    const result = await streamChatCompletion(res, gatewayPayload)

    if (result?.assistantContent) {
      await model.chatMessages.create({
        sessionId: chatSessionId,
        role: "assistant",
        content: result.assistantContent,
        tokenCount: result.tokenCount,
      })
      await model.chatSessions.touch(chatSessionId)
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
  updateSession,
  deleteSession,
  sendMessage,
}
