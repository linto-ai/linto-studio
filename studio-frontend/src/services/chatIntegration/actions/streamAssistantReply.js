import { apiSendChatMessage } from "@/api/chat"
import { generateId } from "@/tools/generateId"

export async function streamAssistantReply(
  { core, scope },
  sessionId,
  { content, mode, lang },
) {
  const chat = core.chat
  chat.addMessage({
    id: `user-${generateId()}`,
    role: "user",
    content,
    createdAt: Date.now(),
  })
  chat.streamStart()

  // Local accumulator → passed to streamEnd (avoids relying on shared state).
  let accumulated = ""
  try {
    await apiSendChatMessage(
      scope,
      sessionId,
      { content, mode, lang },
      {
        onToken(token) {
          accumulated += token
          chat.streamAppend(token)
        },
        onDone(data) {
          chat.streamEnd(accumulated, { tokenCount: data?.usage?.total_tokens })
        },
        onError(err) {
          console.error("[chat] stream error", err)
          chat.streamAbort()
        },
      },
    )
  } finally {
    // Stream closed without a terminal event: commit what arrived so the
    // composer never stays locked
    if (chat.isStreaming.value) {
      if (accumulated) chat.streamEnd(accumulated)
      else chat.streamAbort()
    }
  }
}
