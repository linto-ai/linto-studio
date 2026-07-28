const debug = require("debug")("linto:components:EditorHandler:onLockTurn")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")

/**
 * Acquire-or-refresh a turn lock. Idempotent: the client re-emits it every
 * ~15s while editing (this IS the heartbeat). Wrapped in requireWrite at
 * the composition site, so WRITE access is re-checked on every beat — a
 * revoked right surfaces within one beat as a forbidden ack.
 * turn_locked is broadcast only on a genuine acquisition (not refreshes).
 */
async function onLockTurn({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    // Join + WRITE guaranteed by requireFamily/requireWrite upstream.
    const editorUser = socket.data.editorUser
    const { translationId, turnId } = payload || {}
    if (!turnId) {
      return reply({ ok: false, reason: "invalid_payload" })
    }
    const parentId = socket.data.editorParentId

    const result = await model.editorLocks.acquire({
      parentId,
      translationId,
      turnId,
      userId: editorUser.userId,
      socketId: socket.id,
      userName: editorUser.userName,
    })

    if (!result.acquired) {
      const holder = result.holder
      debug(
        `lock refused turn=${turnId} holder=${holder ? holder.userId : "gone"}`,
      )
      return reply({
        ok: false,
        reason: "locked_by_other",
        holder: holder
          ? { userId: holder.userId, userName: holder.userName }
          : null,
      })
    }

    if (!result.refreshed) {
      debug(`locked turn=${turnId} by user=${editorUser.userId}`)
      io.to(computeEditorRoomName(parentId)).emit("editor:turn_locked", {
        translationId,
        turnId,
        userId: editorUser.userId,
        userName: editorUser.userName,
      })
    }
    reply({ ok: true })
  } catch (err) {
    debug(`lock failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onLockTurn }
