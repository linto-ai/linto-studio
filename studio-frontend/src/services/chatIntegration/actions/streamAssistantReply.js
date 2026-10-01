import { apiSendChatMessage } from "@/api/chat"
import { generateId } from "@/tools/generateId"

// After dispose() the reply keeps streaming (the backend saves it) but is no
// longer shown: the drawer displays another conversation.
export async function streamAssistantReply(discussionId, content) {
  const chat = this.core.chat
  chat.addMessage({
    id: `user-${generateId()}`,
    role: "user",
    content,
    createdAt: Date.now(),
  })
  chat.streamStart()

  // Local accumulator → passed to streamEnd (avoids relying on shared state).
  let accumulated = ""
  await apiSendChatMessage(this.conversationId, discussionId, content, {
    onToken: (token) => {
      accumulated += token
      if (!this.isDisposed) chat.streamAppend(token)
    },
    onDone: (data) => {
      if (this.isDisposed) return
      chat.streamEnd(accumulated, { tokenCount: data?.usage?.total_tokens })
    },
    onError: (err) => {
      console.error("[chat] stream error", err)
      if (!this.isDisposed) chat.streamAbort()
    },
  })

  // Stream closed without a terminal event: commit what arrived so the
  // composer never stays locked
  if (this.isDisposed || !chat.isStreaming.value) return
  if (accumulated) chat.streamEnd(accumulated)
  else chat.streamAbort()
}
