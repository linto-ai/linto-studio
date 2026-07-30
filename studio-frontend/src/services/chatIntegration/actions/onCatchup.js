import { truncateTitle } from "@/tools/truncateTitle"
import { createThread } from "./createThread"
import { streamAssistantReply } from "./streamAssistantReply"

export async function onCatchup(ctx) {
  const { core, catchup } = ctx
  // turnInFlight covers the window before streamStart flips isStreaming,
  // where a double click would otherwise create two threads
  if (core.chat.isStreaming.value || ctx.turnInFlight) return

  ctx.turnInFlight = true
  try {
    const sessionId = await createThread(ctx, truncateTitle(catchup.content))
    if (!sessionId) return

    await streamAssistantReply(ctx, sessionId, {
      content: catchup.content,
      mode: "catchup",
      lang: catchup.lang,
    })
  } finally {
    ctx.turnInFlight = false
  }
}
