/**
 * The title a discussion gets from its first message: the message, cut
 * short.
 * @param {string} content - first message
 * @param {number} [maxLength=30]
 * @returns {string}
 */
export function computeDiscussionTitle(content, maxLength = 30) {
  const trimmed = content.trim()
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, maxLength).trimEnd()}...`
}
