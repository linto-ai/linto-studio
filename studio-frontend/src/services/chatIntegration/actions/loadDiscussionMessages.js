import { apiGetChatDiscussion } from "@/api/chat"
import { mapMessage } from "../helpers"
import { showDiscussion } from "./showDiscussion"

export async function loadDiscussionMessages(chatIntegration, discussionId) {
  const { core, conversationId } = chatIntegration
  const chat = core.chat
  showDiscussion(chatIntegration, discussionId, [])
  chat.setLoadingSession(true)
  const messages = await fetchMessages(conversationId, discussionId)
  // Another discussion (or conversation) was shown meanwhile: it owns the
  // messages and the loading state now
  if (chatIntegration.isDisposed) return
  if (chat.activeSessionId.value !== discussionId) return
  chat.setMessages(messages)
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
