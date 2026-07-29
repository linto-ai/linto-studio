const debug = require("debug")(
  "linto:components:EditorHandler:releaseSocketLocks",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")

/**
 * Release the locks a socket holds (all, or one conversation via scope) and
 * notify each parent room. Throws on storage failure: callers own logging.
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
