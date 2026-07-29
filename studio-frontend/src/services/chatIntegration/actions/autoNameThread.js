import { apiUpdateChatSessionTitle } from "@/api/chat"
import { truncateTitle } from "@/tools/truncateTitle"

// Optimistic: the sidebar updates now, the PATCH follows in the background.
export function autoNameThread({ core, scope }, sessionId, content) {
  const title = truncateTitle(content)
  core.chat.updateSessionTitle(sessionId, title)
  apiUpdateChatSessionTitle(scope, sessionId, title).catch((e) =>
    console.error("[chat] auto-rename failed", e),
  )
}
