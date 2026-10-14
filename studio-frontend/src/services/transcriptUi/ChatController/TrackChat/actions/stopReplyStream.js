// The reply being streamed belongs to the discussion shown: shown another
// one, it stops (the drawer would append it to the wrong discussion).
export function stopReplyStream(trackChat) {
  trackChat.replyStream?.abort()
  trackChat.replyStream = null
  trackChat.core.chat.streamAbort()
}
