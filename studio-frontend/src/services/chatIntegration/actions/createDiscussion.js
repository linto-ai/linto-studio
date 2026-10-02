import { addDiscussion } from "./addDiscussion"
import { notifyError } from "./notifyError"

export async function createDiscussion(chatIntegration) {
  const discussionId = await addDiscussion(chatIntegration)
  if (!discussionId) {
    notifyError(chatIntegration, "chat.errors.create_discussion")
  }
}
