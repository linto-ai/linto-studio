// The only way the shown discussion changes. A reply still streaming stays
// bound to the discussion left: it is detached for good (never displayed
// again, even if that discussion is reopened mid-stream), the backend saves
// it, and reopening the discussion once it is done shows it.
export function showDiscussion(chatIntegration, discussionId, messages) {
  const chat = chatIntegration.core.chat
  chatIntegration.displayedStream = null
  chat.streamAbort()
  chat.setLoadingSession(false)
  chat.setActiveSession(discussionId)
  chat.setMessages(messages)
}
