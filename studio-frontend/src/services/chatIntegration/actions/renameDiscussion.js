import { apiUpdateChatDiscussionTitle } from "@/api/chat"
import { notifyError } from "./notifyError"

export async function renameDiscussion(chatIntegration, discussionId, title) {
  const { core, conversationId } = chatIntegration
  const ok = await apiUpdateChatDiscussionTitle(
    conversationId,
    discussionId,
    title,
  )
  if (!ok) {
    notifyError(chatIntegration, "chat.errors.rename_discussion")
    return
  }
  core.chat.updateSessionTitle(discussionId, title)
}
