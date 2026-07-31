import { apiUpdateChatDiscussionTitle } from "@/api/chat"

export async function renameDiscussion(discussionId, title) {
  try {
    await apiUpdateChatDiscussionTitle(this.scope, discussionId, title)
    this.core.chat.updateDiscussionTitle(discussionId, title)
  } catch (e) {
    console.error("[chat] rename discussion failed", e)
  }
}
