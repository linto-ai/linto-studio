import { apiDeleteChatSession } from "@/api/chat"
import { onLoadSessions } from "./onLoadSessions"

export async function onDeleteSession(ctx, sessionId) {
  const { core } = ctx
  const ok = await apiDeleteChatSession(ctx.scope, sessionId)
  if (!ok) {
    console.error("[chat] delete session failed")
    return
  }
  const wasActive = core.chat.activeSessionId.value === sessionId
  await onLoadSessions(ctx)
  if (wasActive) {
    core.chat.setActiveSession(null)
    core.chat.setMessages([])
  }
}
