const debug = require("debug")(
  "linto:components:EditorHandler:beforeHandleMessage",
)

const { hasAccess } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)
const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)
const { parseDocumentName } = require("../utils/parseDocumentName")

// Max time a revoked WRITE right stays effective on an active connection
// before beforeHandleMessage re-checks against Mongo.
const RIGHTS_RECHECK_MS = 300000

// Re-validate write rights on incoming edits. onAuthenticate only runs at
// connect, so a user whose WRITE right is revoked mid-session would otherwise
// keep editing until they disconnect. Read-only connections can't write, so
// they need no re-check. A per-connection TTL bounds the revocation window
// without hitting Mongo on every keystroke.
async function beforeHandleMessage({ documentName, context, connection }) {
  if (!connection || connection.readOnly) return
  if (!context || !context.userId) return

  const now = Date.now()
  if (
    context.rightsCheckedAt &&
    now - context.rightsCheckedAt < RIGHTS_RECHECK_MS
  ) {
    return
  }

  const conversationId =
    context.conversationId ?? parseDocumentName(documentName)?.conversationId
  const stillCanWrite = await hasAccess(
    conversationId,
    context.userId,
    CONVERSATION_RIGHTS.WRITE,
  )
  if (!stillCanWrite) {
    // Write right revoked since connect. Reject the message: Hocuspocus
    // closes the connection. The client may reconnect and will then be
    // re-evaluated by onAuthenticate (read-only or forbidden).
    debug(
      `beforeHandleMessage: write revoked doc=${documentName} user=${context.userId}, closing`,
    )
    throw new Error("Write access revoked")
  }
  context.rightsCheckedAt = now
}

module.exports = { beforeHandleMessage, RIGHTS_RECHECK_MS }
