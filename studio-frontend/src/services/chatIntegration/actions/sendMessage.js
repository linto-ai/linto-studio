import { generateId } from "@/tools/generateId"
import { truncateTitle } from "@/tools/truncateTitle"
import { addDiscussion } from "./addDiscussion"
import { autoNameDiscussion } from "./autoNameDiscussion"
import { showErrorReply } from "./showErrorReply"
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
    discussionId = await addNamedDiscussion(chatIntegration, content)
    if (!discussionId) {
      showUnsentMessage(chatIntegration, content)
      return
    }
  } else if (chat.messages.value.length === 0) {
    autoNameDiscussion(chatIntegration, discussionId, content)
  }

  await streamAssistantReply(chatIntegration, discussionId, content)
}

async function addNamedDiscussion(chatIntegration, content) {
  chatIntegration.isCreatingDiscussion = true
  try {
    return await addDiscussion(chatIntegration, truncateTitle(content))
  } finally {
    chatIntegration.isCreatingDiscussion = false
  }
}

// The composer is already cleared: keep the question visible, answered by
// the failure. The next send creates the discussion and starts afresh.
function showUnsentMessage(chatIntegration, content) {
  if (chatIntegration.isDisposed) return
  chatIntegration.core.chat.addMessage({
    id: `user-${generateId()}`,
    role: "user",
    content,
    createdAt: Date.now(),
  })
  showErrorReply(chatIntegration, {
    titleKey: "chat.errors.unsent_title",
    messages: [{ key: "chat.errors.create_discussion" }],
    action: null,
  })
}
