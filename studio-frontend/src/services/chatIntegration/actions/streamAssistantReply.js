import { apiSendChatMessage } from "@/api/chat"
import { generateId } from "@/tools/generateId"

// The reply is displayed only while this very stream is the displayed one:
// once another discussion (or conversation) is shown, it keeps streaming and
// the backend saves it, but it is never displayed again (see showDiscussion).
export async function streamAssistantReply(
  chatIntegration,
  discussionId,
  content,
) {
  const { core, conversationId } = chatIntegration
  const chat = core.chat
  const stream = Symbol(discussionId)
  chatIntegration.displayedStream = stream
  chat.addMessage({
    id: `user-${generateId()}`,
    role: "user",
    content,
    createdAt: Date.now(),
  })
  chat.streamStart()

  function isShown() {
    return chatIntegration.displayedStream === stream
  }

  // Local accumulator → passed to streamEnd (avoids relying on shared state).
  let accumulated = ""
  await apiSendChatMessage(conversationId, discussionId, content, {
    onToken(token) {
      accumulated += token
      if (isShown()) chat.streamAppend(token)
    },
    onDone(data) {
      if (!isShown()) return
      chat.streamEnd(accumulated, { tokenCount: data?.usage?.total_tokens })
    },
    onError(err) {
      console.error("[chat] stream error", err)
      if (isShown()) chat.streamAbort()
    },
  })

  // Stream closed without a terminal event: commit what arrived so the
  // composer never stays locked
  if (!isShown() || !chat.isStreaming.value) return
  if (accumulated) chat.streamEnd(accumulated)
  else chat.streamAbort()
}
