import { apiUpdateChatDiscussionTitle } from "@/api/chat"
import { truncateTitle } from "@/tools/truncateTitle"

// Optimistic: the list updates now, the PATCH follows in the background.
export function autoNameDiscussion(chatIntegration, discussionId, content) {
  const { core, conversationId } = chatIntegration
  const title = truncateTitle(content)
  core.chat.updateSessionTitle(discussionId, title)
  apiUpdateChatDiscussionTitle(conversationId, discussionId, title).catch((e) =>
    console.error("[chat] auto-rename failed", e),
  )
}
