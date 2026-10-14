import { apiCreateChatSession, apiListChatSessions } from "@/api/chat"
import { mapDiscussion } from "@/tools/chat/mapDiscussion.js"
import { stopReplyStream } from "./stopReplyStream.js"

// Starts an empty discussion and shows it. Resolves to its id, null when it
// could not be created (or the track is no longer followed).
export async function createDiscussion(trackChat) {
  const { chat } = trackChat.core
  const discussionId = await requestDiscussion(trackChat.trackId)
  if (trackChat.destroyed || !discussionId) return null
  const discussions = await apiListChatSessions(trackChat.trackId)
  if (trackChat.destroyed) return null
  stopReplyStream(trackChat)
  chat.setSessions(discussions.map(mapDiscussion))
  chat.setActiveSession(discussionId)
  chat.setMessages([])
  chat.setLoadingSession(false)
  return discussionId
}

async function requestDiscussion(trackId) {
  try {
    const discussion = await apiCreateChatSession(trackId)
    return discussion._id
  } catch (error) {
    console.error("cannot create a discussion", error)
    return null
  }
}
