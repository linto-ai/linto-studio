import { apiUpdateChatDiscussionTitle } from "@/api/chat"
import { truncateTitle } from "@/tools/truncateTitle"

// Optimistic: the sidebar updates now, the PATCH follows in the background.
export function autoNameDiscussion(discussionId, content) {
  const title = truncateTitle(content)
  this.core.chat.updateDiscussionTitle(discussionId, title)
  apiUpdateChatDiscussionTitle(this.scope, discussionId, title).catch((e) =>
    console.error("[chat] auto-rename failed", e),
  )
}
