const debug = require("debug")("linto:components:EditorHandler:requireFamily")

/**
 * Decorator: payload.translationId must be in the family frozen on socket.data
 * at join (spoofing guard); a track created mid-session needs a re-join.
 */
function requireFamily(handler) {
  return async function familyCheckedHandler({ io, socket }, payload, ack) {
    const reply = typeof ack === "function" ? ack : () => {}
    try {
      const { editorUser, editorParentId, editorFamily } = socket.data
      if (!editorUser || !editorParentId || !editorFamily) {
        return reply({ ok: false, reason: "unauthorized" })
      }
      const { translationId } = payload || {}
      if (!translationId) {
        return reply({ ok: false, reason: "invalid_payload" })
      }
      if (!editorFamily.has(translationId)) {
        debug(
          `mutation refused (outside family) translation=${translationId} parent=${editorParentId}`,
        )
        return reply({ ok: false, reason: "forbidden" })
      }

      return await handler({ io, socket }, payload, ack)
    } catch (err) {
      debug(`family check failed: ${err.message}`)
      reply({ ok: false, reason: "error" })
    }
  }
}

module.exports = { requireFamily }
