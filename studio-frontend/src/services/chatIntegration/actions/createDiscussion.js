import { apiCreateChatDiscussion } from "@/api/chat"
import { mapDiscussion } from "../helpers"

// Prepends the POST response instead of refetching (the list is newest
// first); returns the new id, or null on failure
export async function createDiscussion(title) {
  try {
    const discussion = await apiCreateChatDiscussion(this.conversationId, {
      title,
    })
    // A list still loading would overwrite the prepended discussion; it may
    // also already contain it
    await this.discussionsInFlight
    if (this.isDisposed) return null

    const chat = this.core.chat
    const others = chat.sessions.value.filter((d) => d.id !== discussion._id)
    chat.setActiveSession(discussion._id)
    chat.setMessages([])
    chat.setSessions([mapDiscussion(discussion), ...others])
    return discussion._id
  } catch (e) {
    console.error("[chat] create discussion failed", e)
    return null
  }
}
