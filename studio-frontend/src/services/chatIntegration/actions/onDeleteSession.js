import { apiDeleteChatSession } from "@/api/chat"

export async function onDeleteSession({ core, scope }, sessionId) {
  const ok = await apiDeleteChatSession(scope, sessionId)
  if (!ok) {
    console.error("[chat] delete session failed")
    return
  }
  const chat = core.chat
  chat.setSessions(chat.sessions.value.filter((s) => s.id !== sessionId))
  if (chat.activeSessionId.value === sessionId) {
    chat.setActiveSession(null)
    chat.setMessages([])
  }
}
