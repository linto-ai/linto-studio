/**
 * Classic Studio page of a conversation (transcription editor).
 * @param {string} organizationId
 * @param {string} conversationId
 * @returns {string} absolute path on the same origin
 */
export function buildStudioConversationUrl(organizationId, conversationId) {
  return `/interface/${encodeURIComponent(organizationId)}/conversations/${encodeURIComponent(conversationId)}/transcription`
}
