import { apiListChatSessions } from "@/api/chat"
import { mapDiscussion } from "@/tools/chat/mapDiscussion.js"

// The discussions of the track: an empty list when the request failed.
export async function loadDiscussions(trackChat) {
  const discussions = await apiListChatSessions(trackChat.trackId)
  if (trackChat.destroyed) return
  trackChat.core.chat.setSessions(discussions.map(mapDiscussion))
}
