import { truncateTitle } from "@/tools/truncateTitle"
import { autoNameThread } from "./autoNameThread"
import { createThread } from "./createThread"
import { streamAssistantReply } from "./streamAssistantReply"

export async function onSend(ctx, content) {
  const chat = ctx.core.chat
  const isFirstMessage = chat.messages.value.length === 0

  // A new thread is named in the create request itself; an existing empty
  // thread gets its title patched on its first message.
  let sessionId = chat.activeSessionId.value
  if (!sessionId) {
    sessionId = await createThread(ctx, truncateTitle(content))
    if (!sessionId) return
  } else if (isFirstMessage) {
    autoNameThread(ctx, sessionId, content)
  }

  await streamAssistantReply(ctx, sessionId, { content })
}
