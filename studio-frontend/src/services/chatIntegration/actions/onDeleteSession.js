import { apiDeleteChatSession, apiListChatSessions } from "@/api/chat"
import { mapSession } from "../helpers"

export async function onDeleteSession({ core, conversationId }, sessionId) {
  const ok = await apiDeleteChatSession(conversationId, sessionId)
  if (!ok) {
    console.error("[chat] delete session failed")
    return
  }
  const wasActive = core.chat.activeSessionId.value === sessionId
  const sessions = await apiListChatSessions(conversationId)
  core.chat.setSessions(sessions.map(mapSession))
  if (wasActive) {
    core.chat.setActiveSession(null)
    core.chat.setMessages([])
  }
}
