const debug = require("debug")("linto:components:EditorHandler:onLeave")

const { releaseSocketLocks } = require("./releaseSocketLocks")
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")

// SPA navigation emits leave (the socket outlives the view): release this
// conversation's locks now, not at TTL, or others see a ghost editing badge.
async function onLeave({ io, socket }, conversationId) {
  debug(`editor:leave conv=${conversationId} socket=${socket.id}`)
  try {
    await releaseSocketLocks({ io, socket }, { parentId: conversationId })
  } catch (err) {
    debug(`leave cleanup failed conv=${conversationId}: ${err.message}`)
  }
  socket.leave(computeEditorRoomName(conversationId))
  // editorUser stays: identity is connection-scoped (token-bound), while
  // parent/family are view-scoped — a mutation after leave must re-join.
  if (socket.data.editorParentId === conversationId) {
    delete socket.data.editorParentId
    delete socket.data.editorFamily
  }
}

module.exports = { onLeave }
