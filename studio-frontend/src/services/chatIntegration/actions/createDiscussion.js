import { apiCreateChatDiscussion } from "@/api/chat"
import { mapDiscussion } from "../helpers"
import { showDiscussion } from "./showDiscussion"

// Prepends the POST response instead of refetching (the list is newest
// first); returns the new id, or null on failure
export async function createDiscussion(chatIntegration, title) {
  const { core, conversationId } = chatIntegration
  try {
    const discussion = await apiCreateChatDiscussion(conversationId, { title })
    // A list still loading would overwrite the prepended discussion; it may
    // also already contain it
    await chatIntegration.discussionsInFlight
    if (chatIntegration.isDisposed) return null

    const chat = core.chat
    const others = chat.sessions.value.filter((d) => d.id !== discussion._id)
    chat.setSessions([mapDiscussion(discussion), ...others])
    showDiscussion(chatIntegration, discussion._id, [])
    return discussion._id
  } catch (e) {
    console.error("[chat] create discussion failed", e)
    return null
  }
}
