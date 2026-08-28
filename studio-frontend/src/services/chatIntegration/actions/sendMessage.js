import { truncateTitle } from "@/tools/truncateTitle"

export async function sendMessage(content) {
  const chat = this.core.chat
  // turnInFlight covers the window before streamStart flips isStreaming,
  // where a rapid re-send would otherwise create two discussions
  if (chat.isStreaming.value || this.turnInFlight) return

  this.turnInFlight = true
  try {
    const isFirstMessage = chat.messages.value.length === 0

    // A new discussion is named in the create request itself; an existing
    // empty discussion gets its title patched on its first message.
    let discussionId = chat.activeDiscussionId.value
    if (!discussionId) {
      discussionId = await this.createDiscussion(truncateTitle(content))
      if (!discussionId) return
    } else if (isFirstMessage) {
      this.autoNameDiscussion(discussionId, content)
    }

    await this.streamAssistantReply(discussionId, content)
  } finally {
    this.turnInFlight = false
  }
}
