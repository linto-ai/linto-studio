import { apiUpdateChatSessionTitle } from "@/api/chat"

export async function renameDiscussion(trackChat, discussionId, title) {
  try {
    await apiUpdateChatSessionTitle(trackChat.trackId, discussionId, title)
  } catch (error) {
    console.error("cannot rename the discussion", discussionId, error)
    return
  }
  if (trackChat.destroyed) return
  trackChat.core.chat.updateSessionTitle(discussionId, title)
}
