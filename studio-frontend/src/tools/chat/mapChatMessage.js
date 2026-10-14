/**
 * A message of the API in the shape of the SDK chat plugin. A message
 * without id gets a stable one from its role and position.
 * @param {{ _id?: string, role: string, content: string, created_at?: string, tokenCount?: number }} message
 * @param {number} index - position in the discussion
 * @returns {object} SDK chat message
 */
export function mapChatMessage(message, index) {
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
