import { apiCreateChatSession } from "@/api/chat"
import { mapSession } from "../helpers"

// The POST response already carries the created thread: prepend it instead
// of refetching the list. Returns the new thread id, or null on failure.
export async function createThread({ core, scope }) {
  const chat = core.chat
  try {
    const session = await apiCreateChatSession(scope)
    chat.setActiveSession(session._id)
    chat.setMessages([])
    chat.setSessions([mapSession(session), ...chat.sessions.value])
    return session._id
  } catch (e) {
    console.error("[chat] create session failed", e)
    return null
  }
}
