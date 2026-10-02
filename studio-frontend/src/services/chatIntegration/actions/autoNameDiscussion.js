import { apiUpdateChatDiscussionTitle } from "@/api/chat"
import { truncateTitle } from "@/tools/truncateTitle"

// Optimistic: the list updates now, the PATCH follows in the background. A
// failure stays silent: it comes with the message it names, whose own
// failure is already answered in the thread.
export async function autoNameDiscussion(
  chatIntegration,
  discussionId,
  content,
) {
  const { core, conversationId } = chatIntegration
  const title = truncateTitle(content)
  core.chat.updateSessionTitle(discussionId, title)
  const ok = await apiUpdateChatDiscussionTitle(
    conversationId,
    discussionId,
    title,
  )
  if (!ok) console.error("[chat] auto-rename failed")
}
