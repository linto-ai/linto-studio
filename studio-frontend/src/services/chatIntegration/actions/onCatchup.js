import { autoNameThread } from "./autoNameThread"
import { createThread } from "./createThread"
import { streamAssistantReply } from "./streamAssistantReply"

export async function onCatchup(ctx) {
  const { core, catchup } = ctx
  if (core.chat.isStreaming.value) return

  const sessionId = await createThread(ctx)
  if (!sessionId) return

  autoNameThread(ctx, sessionId, catchup.content)
  await streamAssistantReply(ctx, sessionId, {
    content: catchup.content,
    mode: "catchup",
    lang: catchup.lang,
  })
}
