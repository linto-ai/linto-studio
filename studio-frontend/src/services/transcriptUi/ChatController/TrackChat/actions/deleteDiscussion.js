import { apiDeleteChatSession, apiListChatSessions } from "@/api/chat"
import { mapDiscussion } from "@/tools/chat/mapDiscussion.js"
import { stopReplyStream } from "./stopReplyStream.js"

export async function deleteDiscussion(trackChat, discussionId) {
  const { chat } = trackChat.core
  const deleted = await apiDeleteChatSession(trackChat.trackId, discussionId)
  if (trackChat.destroyed) return
  if (!deleted) {
    console.error("cannot delete the discussion", discussionId)
    return
  }
  const discussions = await apiListChatSessions(trackChat.trackId)
  if (trackChat.destroyed) return
  chat.setSessions(discussions.map(mapDiscussion))
  // Checked once the list is back: another discussion may be shown by then
  if (chat.activeSessionId.value === discussionId) {
    stopReplyStream(trackChat)
    chat.setActiveSession(null)
    chat.setMessages([])
    // Its messages may still be loading: they will be dropped
    chat.setLoadingSession(false)
  }
}
