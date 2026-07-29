import { apiCreateChatSession, apiListChatSessions } from "@/api/chat"
import { mapSession } from "../helpers"

export async function onCreateSession({ core, scope }) {
  try {
    const session = await apiCreateChatSession(scope)
    const sessions = await apiListChatSessions(scope)
    core.chat.setSessions(sessions.map(mapSession))
    core.chat.setActiveSession(session._id)
    core.chat.setMessages([])
  } catch (e) {
    console.error("[chat] create session failed", e)
  }
}
