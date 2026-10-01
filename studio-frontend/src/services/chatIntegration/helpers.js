// Maps the API shapes (_id) to the SDK chat plugin shapes (id).
// The wire still calls a discussion a "session".

export function mapDiscussion(apiSession) {
  return { id: apiSession._id, title: apiSession.title }
}

export function mapMessage(message, index) {
  return {
    id: message._id ?? `${message.role}-${index}`,
    role: message.role,
    content: message.content,
    createdAt: message.created_at
      ? new Date(message.created_at).getTime()
      : undefined,
    tokenCount: message.tokenCount,
  }
}

// The drawer keeps nothing of the conversation it leaves. core.chat is gone
// when the editor was torn down first.
export function resetChat(core) {
  core.chat?.streamAbort()
  core.chat?.setSessions([])
  core.chat?.setActiveSession(null)
  core.chat?.setMessages([])
  core.chat?.setLoadingSession(false)
}
