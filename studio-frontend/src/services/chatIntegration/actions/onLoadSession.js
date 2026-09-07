import { apiGetChatSession } from "@/api/chat"
import { mapMessage } from "../helpers"

export async function onLoadSession({ core, conversationId }, sessionId) {
  core.chat.setActiveSession(sessionId)
  core.chat.setLoadingSession(true)
  try {
    const session = await apiGetChatSession(conversationId, sessionId)
    core.chat.setMessages((session.messages || []).map(mapMessage))
  } catch (e) {
    console.error("[chat] load session failed", e)
    core.chat.setMessages([])
  } finally {
    core.chat.setLoadingSession(false)
  }
}
