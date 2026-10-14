import { apiSendChatMessage, apiUpdateChatSessionTitle } from "@/api/chat"
import { computeDiscussionTitle } from "@/tools/chat/computeDiscussionTitle.js"
import { createDiscussion } from "./createDiscussion.js"

// Sends a message and streams the reply into the discussion shown, created
// on the first message if none is. The discussion is named after its first
// message. One message at a time: the composer stays disabled from the
// send to the end of the reply (loading while the discussion is created,
// then streaming), so no message typed meanwhile is lost.
export async function sendMessage(trackChat, content) {
  if (trackChat.isSending) return
  trackChat.isSending = true
  try {
    await send(trackChat, content)
  } finally {
    trackChat.isSending = false
  }
}

async function send(trackChat, content) {
  const discussionId = await ensureDiscussion(trackChat)
  if (trackChat.destroyed || !discussionId) return
  const { chat } = trackChat.core
  const isFirstMessage = chat.messages.value.length === 0

  chat.addMessage({
    id: `user-${Date.now()}`,
    role: "user",
    content,
    createdAt: Date.now(),
  })
  if (isFirstMessage) nameDiscussion(trackChat, discussionId, content)
  await streamReply(trackChat, discussionId, content)
}

// The discussion shown, or a new one. createDiscussion ends the loading
// state when it succeeds.
async function ensureDiscussion(trackChat) {
  const { chat } = trackChat.core
  if (chat.activeSessionId.value) return chat.activeSessionId.value
  chat.setLoadingSession(true)
  const discussionId = await createDiscussion(trackChat)
  if (!discussionId && !trackChat.destroyed) chat.setLoadingSession(false)
  return discussionId
}

function nameDiscussion(trackChat, discussionId, content) {
  const title = computeDiscussionTitle(content)
  trackChat.core.chat.updateSessionTitle(discussionId, title)
  apiUpdateChatSessionTitle(trackChat.trackId, discussionId, title).catch(
    (error) => console.error("cannot name the discussion", error),
  )
}

// The reply is committed once the stream is over, so the composer stays
// disabled until the message is fully sent. Stopped (no callback any more)
// when the track or the discussion shown changes, see stopReplyStream. A
// stream closed without its end event keeps what it received.
async function streamReply(trackChat, discussionId, content) {
  const { chat } = trackChat.core
  const replyStream = new AbortController()
  trackChat.replyStream = replyStream
  chat.streamStart()
  let reply = ""
  let done = false
  let tokenCount
  let failure = null
  await apiSendChatMessage(trackChat.trackId, discussionId, content, {
    signal: replyStream.signal,
    onToken(token) {
      reply += token
      chat.streamAppend(token)
    },
    onDone(data) {
      done = true
      tokenCount = data?.usage?.total_tokens
    },
    onError(error) {
      failure = error
    },
  })
  if (replyStream.signal.aborted) return
  trackChat.replyStream = null
  if (done || (reply && !failure)) {
    chat.streamEnd(reply, { tokenCount })
    return
  }
  console.error("chat reply failed", failure)
  chat.streamAbort()
  chat.addMessage({
    id: `error-${Date.now()}`,
    role: "assistant",
    content: "",
    error: { title: trackChat.chatController.t("chat.error") },
  })
}
