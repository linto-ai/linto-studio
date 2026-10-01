import { apiDeleteChatDiscussion } from "@/api/chat"

export async function deleteDiscussion(discussionId) {
  const ok = await apiDeleteChatDiscussion(this.conversationId, discussionId)
  if (!ok) {
    console.error("[chat] delete discussion failed")
    return
  }
  // A list still loading would bring the deleted discussion back
  await this.discussionsInFlight
  if (this.isDisposed) return

  const chat = this.core.chat
  chat.setSessions(chat.sessions.value.filter((d) => d.id !== discussionId))
  if (chat.activeSessionId.value === discussionId) {
    chat.setActiveSession(null)
    chat.setMessages([])
  }
}
