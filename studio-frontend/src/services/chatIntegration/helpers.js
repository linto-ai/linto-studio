// Mapping + small helpers between the API shape (api/chat.js) and the SDK
// chat plugin shape (core.chat.*). The SDK is agnostic: it uses `id`, the API
// returns `_id`.

export function mapSession(session) {
  return { id: session._id, title: session.title }
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
