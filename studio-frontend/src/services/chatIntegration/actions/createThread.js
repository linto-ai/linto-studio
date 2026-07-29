import { apiCreateChatSession } from "@/api/chat"
import { mapSession } from "../helpers"

// Prepends the POST response instead of refetching; returns the id or null
export async function createThread({ core, scope }, title) {
  const chat = core.chat
  try {
    const session = await apiCreateChatSession(scope, { title })
    chat.setActiveSession(session._id)
    chat.setMessages([])
    chat.setSessions([mapSession(session), ...chat.sessions.value])
    return session._id
  } catch (e) {
    console.error("[chat] create session failed", e)
    return null
  }
}
