const debug = require("debug")("linto:components:EditorHandler:requireFamily")

/**
 * Handler decorator: the mutation's translationId must belong to the
 * conversation FAMILY the socket joined (parent + children + grandchildren,
 * frozen on socket.data at join time). Closes the spoofing vector where a
 * payload targets another conversation's room, and lets handlers derive the
 * broadcast room from socket.data.editorParentId instead of trusting the
 * payload.
 *
 * The family is frozen at join: a track created mid-session (new translation
 * job) needs a re-join to become editable — acceptable, structure changes
 * are rare and page-level.
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
