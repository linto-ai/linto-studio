const debug = require("debug")("linto:components:EditorHandler:onUnlockTurn")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")

// Release is socket-scoped in the model, so NO requireWrite: a right revoked
// mid-edit must still allow release (join guaranteed by requireFamily).
async function onUnlockTurn({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const editorUser = socket.data.editorUser
    const { translationId, turnId } = payload || {}
    if (!translationId || !turnId) {
      return reply({ ok: false, reason: "invalid_payload" })
    }
    const parentId = socket.data.editorParentId

    const released = await model.editorLocks.release(
      translationId,
      turnId,
      socket.id,
    )
    if (!released) {
      return reply({ ok: false, reason: "not_lock_owner" })
    }

    debug(`unlocked turn=${turnId} by user=${editorUser.userId}`)
    io.to(computeEditorRoomName(parentId)).emit("editor:turn_unlocked", {
      translationId,
      turnId,
    })
    reply({ ok: true })
  } catch (err) {
    debug(`unlock failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onUnlockTurn }
