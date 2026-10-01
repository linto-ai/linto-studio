import { apiListChatDiscussions } from "@/api/chat"
import { mapDiscussion } from "../helpers"

// Single-flight: reopening the drawer re-requests the list; share one GET.
export function loadDiscussions(chatIntegration) {
  if (!chatIntegration.discussionsInFlight) {
    chatIntegration.discussionsInFlight = fetchDiscussions(
      chatIntegration,
    ).finally(() => {
      chatIntegration.discussionsInFlight = null
    })
  }
  return chatIntegration.discussionsInFlight
}

async function fetchDiscussions(chatIntegration) {
  const { core, conversationId } = chatIntegration
  try {
    const discussions = await apiListChatDiscussions(conversationId)
    if (chatIntegration.isDisposed) return
    core.chat.setSessions(discussions.map(mapDiscussion))
  } catch (e) {
    console.error("[chat] load discussions failed", e)
  }
}
