const debug = require("debug")("linto:components:EditorHandler2:onLeave")

const { releaseSocketLocks } = require("./releaseSocketLocks")
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")

// The app socket outlives the editor view (SPA navigation emits leave, not
// disconnect): locks still held on THIS conversation must be released now,
// not after the 45s TTL — others would see a ghost "X is editing" badge.
async function onLeave({ io, socket }, conversationId) {
  debug(`editor:leave conv=${conversationId} socket=${socket.id}`)
  try {
    await releaseSocketLocks({ io, socket }, { parentId: conversationId })
  } catch (err) {
    debug(`leave cleanup failed conv=${conversationId}: ${err.message}`)
  }
  socket.leave(computeEditorRoomName(conversationId))
  // socket.data.editorUser is deliberately NOT cleared: identity is
  // connection-scoped (token-bound at handshake), not view-scoped.
}

module.exports = { onLeave }
