import { apiUpdateChatDiscussionTitle } from "@/api/chat"

export async function renameDiscussion(chatIntegration, discussionId, title) {
  const { core, conversationId } = chatIntegration
  try {
    await apiUpdateChatDiscussionTitle(conversationId, discussionId, title)
    core.chat.updateSessionTitle(discussionId, title)
  } catch (e) {
    console.error("[chat] rename discussion failed", e)
  }
}
