import { apiUpdateChatDiscussionTitle } from "@/api/chat"
import { truncateTitle } from "@/tools/truncateTitle"

// Optimistic: the list updates now, the PATCH follows in the background.
export function autoNameDiscussion(discussionId, content) {
  const title = truncateTitle(content)
  this.core.chat.updateSessionTitle(discussionId, title)
  apiUpdateChatDiscussionTitle(this.conversationId, discussionId, title).catch(
    (e) => console.error("[chat] auto-rename failed", e),
  )
}
