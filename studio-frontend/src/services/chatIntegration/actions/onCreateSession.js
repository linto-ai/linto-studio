import { apiCreateChatSession, apiListChatSessions } from "@/api/chat"
import { mapSession } from "../helpers"

export async function onCreateSession({ core, conversationId }) {
  try {
    const session = await apiCreateChatSession(conversationId)
    const sessions = await apiListChatSessions(conversationId)
    core.chat.setSessions(sessions.map(mapSession))
    core.chat.setActiveSession(session._id)
    core.chat.setMessages([])
  } catch (e) {
    console.error("[chat] create session failed", e)
  }
}
