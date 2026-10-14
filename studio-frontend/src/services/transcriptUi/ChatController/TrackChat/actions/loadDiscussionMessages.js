import { apiGetChatSession } from "@/api/chat"
import { mapChatMessage } from "@/tools/chat/mapChatMessage.js"
import { stopReplyStream } from "./stopReplyStream.js"

// Shows a discussion. Dropped when another one was shown meanwhile. The
// discussion already shown stays as is: its reply may be streaming.
export async function loadDiscussionMessages(trackChat, discussionId) {
  const { chat } = trackChat.core
  if (chat.activeSessionId.value === discussionId) return
  stopReplyStream(trackChat)
  chat.setActiveSession(discussionId)
  chat.setLoadingSession(true)
  const messages = await fetchMessages(trackChat.trackId, discussionId)
  if (trackChat.destroyed || chat.activeSessionId.value !== discussionId) return
  chat.setMessages(messages)
  chat.setLoadingSession(false)
}

// No message when the discussion cannot be loaded.
async function fetchMessages(trackId, discussionId) {
  try {
    const discussion = await apiGetChatSession(trackId, discussionId)
    return (discussion.messages ?? []).map(mapChatMessage)
  } catch (error) {
    console.error("cannot load the discussion", discussionId, error)
    return []
  }
}
