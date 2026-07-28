const debug = require("debug")(
  "linto:components:EditorHandler:releaseSocketLocks",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")

/**
 * Shared cleanup (not an event handler): release the locks a socket holds —
 * all of them (disconnect) or those of one conversation (leave) — and tell
 * each parent room. Throws on storage failure: callers own their logging.
 *
 * @param {{io: object, socket: object}} context
 * @param {{parentId?: string}} [scope]
 * @returns {Promise<object[]>} the released lock documents
 */
async function releaseSocketLocks({ io, socket }, scope = {}) {
  const released = await model.editorLocks.releaseAllForSocket(socket.id, scope)
  for (const lock of released) {
    debug(
      `released turn=${lock.turnId} translation=${lock.translationId} socket=${socket.id}`,
    )
    io.to(computeEditorRoomName(lock.parentId)).emit("editor:turn_unlocked", {
      translationId: lock.translationId,
      turnId: lock.turnId,
    })
  }
  return released
}

module.exports = { releaseSocketLocks }
