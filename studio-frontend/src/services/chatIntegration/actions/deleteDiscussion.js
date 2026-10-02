import { apiDeleteChatDiscussion } from "@/api/chat"
import { notifyError } from "./notifyError"
import { showDiscussion } from "./showDiscussion"

export async function deleteDiscussion(chatIntegration, discussionId) {
  const { core, conversationId } = chatIntegration
  const ok = await apiDeleteChatDiscussion(conversationId, discussionId)
  if (!ok) {
    notifyError(chatIntegration, "chat.errors.delete_discussion")
    return
  }
  // A list still loading would bring the deleted discussion back
  await chatIntegration.discussionsInFlight
  if (chatIntegration.isDisposed) return

  const chat = core.chat
  chat.setSessions(chat.sessions.value.filter((d) => d.id !== discussionId))
  if (chat.activeSessionId.value === discussionId) {
    showDiscussion(chatIntegration, null, [])
  }
}
