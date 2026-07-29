const debug = require("debug")("linto:components:EditorHandler:requireWrite")

const access = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)
const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)

/**
 * Decorator for lock-less mutations: the socket must have joined and hold
 * WRITE access on payload.translationId.
 */
function requireWrite(handler) {
  return async function writeCheckedHandler({ io, socket }, payload, ack) {
    const reply = typeof ack === "function" ? ack : () => {}
    try {
      const editorUser = socket.data.editorUser
      if (!editorUser) {
        return reply({ ok: false, reason: "unauthorized" })
      }
      const { translationId } = payload || {}
      if (!translationId) {
        return reply({ ok: false, reason: "invalid_payload" })
      }

      const canWrite = await access.hasAccess(
        translationId,
        editorUser.userId,
        CONVERSATION_RIGHTS.WRITE,
      )
      if (!canWrite) {
        debug(
          `mutation refused (forbidden) translation=${translationId} user=${editorUser.userId}`,
        )
        return reply({ ok: false, reason: "forbidden" })
      }

      return await handler({ io, socket }, payload, ack)
    } catch (err) {
      debug(`write check failed: ${err.message}`)
      reply({ ok: false, reason: "error" })
    }
  }
}

module.exports = { requireWrite }
