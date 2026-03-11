const debug = require("debug")("linto:lib:logger:filterCachedLog")

const DEDUP_WINDOW_MS = 30 * 60 * 1000
const recentPatchByConversation = new Map()

function extractConversationIdFromUrl(url) {
  const match = url.match(/\/conversations\/([a-f0-9]{24})/)
  return match ? match[1] : null
}

// Filters duplicate PATCH activity logs for conversation editing routes:
// - PATCH /api/conversations/:conversationId
// - PATCH /api/conversations/:conversationId/turns/:turnId
// Only the first PATCH per conversation is logged within a 30-minute window.

function isDuplicatePatchEvent(method, url) {
  if (method !== "PATCH") return false

  const conversationId = extractConversationIdFromUrl(url)
  if (!conversationId) return false

  const now = Date.now()
  const lastPatch = recentPatchByConversation.get(conversationId)

  if (lastPatch && now - lastPatch < DEDUP_WINDOW_MS) {
    debug("Skipping duplicate PATCH log for conversation %s", conversationId)
    return true
  }

  // Cleanup old entries
  for (const [id, timestamp] of recentPatchByConversation) {
    if (now - timestamp >= DEDUP_WINDOW_MS) {
      recentPatchByConversation.delete(id)
    }
  }

  recentPatchByConversation.set(conversationId, now)
  return false
}

module.exports = { isDuplicatePatchEvent }
