import {
  apiCreateChatSession,
  apiListChatSessions,
  apiUpdateChatSessionTitle,
  apiSendChatMessage,
} from "@/api/chat"
import { mapSession, truncateTitle } from "../helpers"

export async function onSend({ core, conversationId }, content) {
  const chat = core.chat
  const isFirstMessage = chat.messages.value.length === 0
  let sessionId = chat.activeSessionId.value

  // Create a session on first send if none is active.
  if (!sessionId) {
    try {
      const session = await apiCreateChatSession(conversationId)
      sessionId = session._id
      const sessions = await apiListChatSessions(conversationId)
      chat.setSessions(sessions.map(mapSession))
      chat.setActiveSession(sessionId)
      chat.setMessages([])
    } catch (e) {
      console.error("[chat] create session failed", e)
      return
    }
  }

  // Optimistic user message + start streaming.
  chat.addMessage({
    id: `user-${Date.now()}`,
    role: "user",
    content,
    createdAt: Date.now(),
  })
  chat.streamStart()

  // Auto-name the session from its first message.
  if (isFirstMessage) {
    const title = truncateTitle(content)
    chat.updateSessionTitle(sessionId, title)
    apiUpdateChatSessionTitle(conversationId, sessionId, title).catch((e) =>
      console.error("[chat] auto-rename failed", e),
    )
  }

  // Local accumulator → passed to streamEnd (avoids relying on shared state).
  let accumulated = ""
  await apiSendChatMessage(conversationId, sessionId, content, {
    onToken(token) {
      accumulated += token
      chat.streamAppend(token)
    },
    onDone(data) {
      chat.streamEnd(accumulated, { tokenCount: data?.usage?.total_tokens })
    },
    onError(err) {
      console.error("[chat] stream error", err)
      chat.streamAbort()
    },
  })
}
