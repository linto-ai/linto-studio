import { apiCreateChatDiscussion } from "@/api/chat"
import { mapDiscussion } from "../helpers"

// Prepends the POST response instead of refetching; returns the id or null
export async function createDiscussion(title) {
  const chat = this.core.chat
  try {
    const discussion = await apiCreateChatDiscussion(
      { ...this.scope, channelId: this.core.activeChannelId.value },
      { title },
    )
    chat.setActiveDiscussion(discussion._id)
    chat.setMessages([])
    chat.setDiscussions([mapDiscussion(discussion), ...chat.discussions.value])
    return discussion._id
  } catch (e) {
    console.error("[chat] create discussion failed", e)
    return null
  }
}
