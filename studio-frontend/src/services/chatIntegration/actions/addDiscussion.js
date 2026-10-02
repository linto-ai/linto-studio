import { apiCreateChatDiscussion } from "@/api/chat"
import { mapDiscussion } from "../helpers"
import { showDiscussion } from "./showDiscussion"

// Creates a discussion, prepends it to the list (newest first) instead of
// refetching, and shows it. Returns its id, or null on failure: the caller
// tells the user.
export async function addDiscussion(chatIntegration, title) {
  const { core, conversationId } = chatIntegration
  const discussion = await apiCreateChatDiscussion(conversationId, { title })
  if (!discussion) return null
  // A list still loading would overwrite the prepended discussion; it may
  // also already contain it
  await chatIntegration.discussionsInFlight
  if (chatIntegration.isDisposed) return null

  const chat = core.chat
  const others = chat.sessions.value.filter((d) => d.id !== discussion._id)
  chat.setSessions([mapDiscussion(discussion), ...others])
  showDiscussion(chatIntegration, discussion._id, [])
  return discussion._id
}
