// Maps API shapes (_id) to the SDK chat plugin shapes (id)

export function mapSession(session) {
  return { id: session._id, title: session.title, channelId: session.channelId }
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
