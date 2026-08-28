import { truncateTitle } from "@/tools/truncateTitle"

// Start a fresh discussion seeded with a prompt; requestArgs stays opaque
export async function startDiscussion(prompt, requestArgs) {
  // turnInFlight covers the window before streamStart flips isStreaming,
  // where a double click would otherwise create two discussions
  if (this.core.chat.isStreaming.value || this.turnInFlight) return

  this.turnInFlight = true
  try {
    const discussionId = await this.createDiscussion(truncateTitle(prompt))
    if (!discussionId) return

    await this.streamAssistantReply(discussionId, prompt, requestArgs)
  } finally {
    this.turnInFlight = false
  }
}
