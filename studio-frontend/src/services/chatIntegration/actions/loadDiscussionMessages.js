import { apiGetChatDiscussion } from "@/api/chat"
import { mapMessage } from "../helpers"

export async function loadDiscussionMessages(discussionId) {
  const chat = this.core.chat
  chat.setActiveSession(discussionId)
  chat.setLoadingSession(true)
  const messages = await fetchMessages(this.conversationId, discussionId)
  if (this.isDisposed) return
  // A discussion opened meanwhile keeps its own messages
  if (chat.activeSessionId.value === discussionId) chat.setMessages(messages)
  chat.setLoadingSession(false)
}

async function fetchMessages(conversationId, discussionId) {
  try {
    const discussion = await apiGetChatDiscussion(conversationId, discussionId)
    return (discussion.messages || []).map(mapMessage)
  } catch (e) {
    console.error("[chat] load discussion failed", e)
    return []
  }
}
