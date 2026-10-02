import { apiListChatDiscussions } from "@/api/chat"
import { mapDiscussion } from "../helpers"
import { notifyError } from "./notifyError"

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
  const discussions = await apiListChatDiscussions(conversationId)
  if (chatIntegration.isDisposed) return
  if (!discussions) {
    notifyError(chatIntegration, "chat.errors.load_discussions")
    return
  }
  core.chat.setSessions(discussions.map(mapDiscussion))
}
