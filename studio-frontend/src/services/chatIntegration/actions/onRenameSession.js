import { apiUpdateChatSessionTitle } from "@/api/chat"

export async function onRenameSession({ core, conversationId }, sessionId, title) {
  try {
    await apiUpdateChatSessionTitle(conversationId, sessionId, title)
    core.chat.updateSessionTitle(sessionId, title)
  } catch (e) {
    console.error("[chat] rename session failed", e)
  }
}
