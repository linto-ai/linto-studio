import { apiListChatDiscussions } from "@/api/chat"
import { mapDiscussion } from "../helpers"

// Single-flight: reopening the drawer re-requests the list; share one GET.
export function loadDiscussions() {
  if (!this.discussionsInFlight) {
    this.discussionsInFlight = fetchDiscussions(this).finally(() => {
      this.discussionsInFlight = null
    })
  }
  return this.discussionsInFlight
}

async function fetchDiscussions({ core, scope }) {
  try {
    const discussions = await apiListChatDiscussions(scope)
    core.chat.setDiscussions(discussions.map(mapDiscussion))
  } catch (e) {
    console.error("[chat] load discussions failed", e)
  }
}
