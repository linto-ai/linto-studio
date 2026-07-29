import { autoNameThread } from "./autoNameThread"
import { createThread } from "./createThread"
import { streamAssistantReply } from "./streamAssistantReply"

export async function onSend(ctx, content) {
  const chat = ctx.core.chat
  const isFirstMessage = chat.messages.value.length === 0

  let sessionId = chat.activeSessionId.value
  if (!sessionId) {
    sessionId = await createThread(ctx)
    if (!sessionId) return
  }

  if (isFirstMessage) {
    autoNameThread(ctx, sessionId, content)
  }

  await streamAssistantReply(ctx, sessionId, { content })
}
