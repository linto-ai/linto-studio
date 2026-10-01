import { truncateTitle } from "@/tools/truncateTitle"
import { createDiscussion } from "./createDiscussion"
import { autoNameDiscussion } from "./autoNameDiscussion"
import { streamAssistantReply } from "./streamAssistantReply"

export async function sendMessage(chatIntegration, content) {
  const chat = chatIntegration.core.chat
  // isCreatingDiscussion covers the window before streamStart flips
  // isStreaming, where a rapid re-send would otherwise create two discussions
  if (chat.isStreaming.value || chatIntegration.isCreatingDiscussion) return

  // A new discussion is named in the create request itself; an existing
  // empty discussion gets its title patched on its first message.
  let discussionId = chat.activeSessionId.value
  if (!discussionId) {
    discussionId = await createNamedDiscussion(chatIntegration, content)
    if (!discussionId) return
  } else if (chat.messages.value.length === 0) {
    autoNameDiscussion(chatIntegration, discussionId, content)
  }

  await streamAssistantReply(chatIntegration, discussionId, content)
}

async function createNamedDiscussion(chatIntegration, content) {
  chatIntegration.isCreatingDiscussion = true
  try {
    return await createDiscussion(chatIntegration, truncateTitle(content))
  } finally {
    chatIntegration.isCreatingDiscussion = false
  }
}
