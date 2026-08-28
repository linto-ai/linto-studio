// Maps API shapes (_id) to the SDK chat plugin shapes (id).
// The wire still calls a discussion a "session".

export function mapDiscussion(apiSession) {
  return {
    id: apiSession._id,
    title: apiSession.title,
    channelId: apiSession.channelId,
  }
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
