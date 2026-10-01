import { apiUpdateChatDiscussionTitle } from "@/api/chat"

export async function renameDiscussion(discussionId, title) {
  try {
    await apiUpdateChatDiscussionTitle(this.conversationId, discussionId, title)
    this.core.chat.updateSessionTitle(discussionId, title)
  } catch (e) {
    console.error("[chat] rename discussion failed", e)
  }
}
