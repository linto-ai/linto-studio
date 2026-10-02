import { apiGetChatDiscussion } from "@/api/chat"
import { mapMessage } from "../helpers"
import { notifyError } from "./notifyError"
import { showDiscussion } from "./showDiscussion"

export async function loadDiscussionMessages(chatIntegration, discussionId) {
  const { core, conversationId } = chatIntegration
  const chat = core.chat
  // The list re-selects the shown discussion on click: reloading it would
  // detach the reply streaming in it
  if (chat.activeSessionId.value === discussionId && chat.isStreaming.value) {
    return
  }
  showDiscussion(chatIntegration, discussionId, [])
  chat.setLoadingSession(true)
  const discussion = await apiGetChatDiscussion(conversationId, discussionId)
  // Another discussion (or conversation) was shown meanwhile: it owns the
  // messages and the loading state now
  if (chatIntegration.isDisposed) return
  if (chat.activeSessionId.value !== discussionId) return
  chat.setLoadingSession(false)
  if (!discussion) {
    notifyError(chatIntegration, "chat.errors.load_messages")
    return
  }
  chat.setMessages((discussion.messages || []).map(mapMessage))
}
