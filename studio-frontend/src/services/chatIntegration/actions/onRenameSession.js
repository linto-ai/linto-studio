import { apiUpdateChatSessionTitle } from "@/api/chat"

export async function onRenameSession({ core, scope }, sessionId, title) {
  try {
    await apiUpdateChatSessionTitle(scope, sessionId, title)
    core.chat.updateSessionTitle(sessionId, title)
  } catch (e) {
    console.error("[chat] rename session failed", e)
  }
}
