import { apiListChatDiscussions } from "@/api/chat"
import { mapDiscussion } from "../helpers"

// Single-flight: reopening the drawer re-requests the list; share one GET.
export function loadDiscussions() {
  if (!this.discussionsInFlight) {
    this.discussionsInFlight = fetchDiscussions.call(this).finally(() => {
      this.discussionsInFlight = null
    })
  }
  return this.discussionsInFlight
}

async function fetchDiscussions() {
  try {
    const discussions = await apiListChatDiscussions(this.conversationId)
    if (this.isDisposed) return
    this.core.chat.setSessions(discussions.map(mapDiscussion))
  } catch (e) {
    console.error("[chat] load discussions failed", e)
  }
}
