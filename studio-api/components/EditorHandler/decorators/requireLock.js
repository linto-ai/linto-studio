const debug = require("debug")("linto:components:EditorHandler:requireLock")

const model = require(`${process.cwd()}/lib/mongodb/models`)

/**
 * Handler decorator: the wrapped mutation only runs when the emitting socket
 * holds a LIVE lock on the turn its payload targets ({translationId, turnId}).
 * Enforces the edit contract server-side — a client that lost its lock (TTL,
 * revocation, other tab) gets `not_lock_owner` instead of a silent write.
 */
function requireLock(handler) {
  return async function lockedHandler({ io, socket }, payload, ack) {
    const reply = typeof ack === "function" ? ack : () => {}
    try {
      const { translationId, turnId } = payload || {}
      if (!translationId || !turnId) {
        return reply({ ok: false, reason: "invalid_payload" })
      }

      const held = await model.editorLocks.isHeldBy(
        translationId,
        turnId,
        socket.id,
      )
      if (!held) {
        debug(
          `mutation refused (not_lock_owner) turn=${turnId} socket=${socket.id}`,
        )
        return reply({ ok: false, reason: "not_lock_owner" })
      }

      return await handler({ io, socket }, payload, ack)
    } catch (err) {
      debug(`lock check failed: ${err.message}`)
      reply({ ok: false, reason: "error" })
    }
  }
}

module.exports = { requireLock }
