import { apiGetChatDiscussion } from "@/api/chat"
import { mapMessage } from "../helpers"

export async function loadDiscussionMessages(discussionId) {
  const chat = this.core.chat
  chat.setActiveDiscussion(discussionId)
  chat.setLoadingDiscussion(true)
  try {
    const discussion = await apiGetChatDiscussion(this.scope, discussionId)
    chat.setMessages((discussion.messages || []).map(mapMessage))
  } catch (e) {
    console.error("[chat] load discussion failed", e)
    chat.setMessages([])
  } finally {
    chat.setLoadingDiscussion(false)
  }
}
