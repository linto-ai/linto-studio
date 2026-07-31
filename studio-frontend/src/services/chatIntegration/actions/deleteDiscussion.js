import { apiDeleteChatDiscussion } from "@/api/chat"

export async function deleteDiscussion(discussionId) {
  const ok = await apiDeleteChatDiscussion(this.scope, discussionId)
  if (!ok) {
    console.error("[chat] delete discussion failed")
    return
  }
  const chat = this.core.chat
  chat.setDiscussions(
    chat.discussions.value.filter((d) => d.id !== discussionId),
  )
  if (chat.activeDiscussionId.value === discussionId) {
    chat.setActiveDiscussion(null)
    chat.setMessages([])
  }
}
