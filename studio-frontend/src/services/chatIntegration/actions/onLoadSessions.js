import { apiListChatSessions } from "@/api/chat"
import { mapSession } from "../helpers"

export async function onLoadSessions({ core, conversationId }) {
  try {
    const sessions = await apiListChatSessions(conversationId)
    core.chat.setSessions(sessions.map(mapSession))
  } catch (e) {
    console.error("[chat] load sessions failed", e)
  }
}
