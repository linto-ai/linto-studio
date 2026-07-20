const debug = require("debug")("linto:components:EditorHandler:onAuthenticate")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { verifyAuthToken } = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
const { hasAccess } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)
const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)
const { parseDocumentName } = require("../utils/parseDocumentName")

async function onAuthenticate({ token, documentName, connectionConfig }) {
  debug(`onAuthenticate: doc=${documentName}`)
  const parsed = parseDocumentName(documentName)
  if (!parsed) {
    throw new Error("Invalid document name")
  }
  const { conversationId, epoch } = parsed

  const userData = await verifyAuthToken(token)
  if (!userData) {
    throw new Error("Unauthorized")
  }

  const canWrite = await hasAccess(
    conversationId,
    userData.userId,
    CONVERSATION_RIGHTS.WRITE,
  )
  if (!canWrite) {
    const canRead = await hasAccess(
      conversationId,
      userData.userId,
      CONVERSATION_RIGHTS.READ,
    )
    if (!canRead) {
      throw new Error("Forbidden")
    }
    // Read-only access: the client receives live updates but the server
    // rejects any edit coming from this connection.
    connectionConfig.readOnly = true
  }

  // Reject connections targeting a dead history lineage: the client must
  // refetch the conversation (fresh epoch) and rebuild its Y.Doc.
  const conversation = await model.conversations.getById(conversationId, [
    "editorEpoch",
  ])
  if (!conversation || conversation.length !== 1) {
    throw new Error(`Conversation ${conversationId} not found`)
  }
  const currentEpoch = conversation[0].editorEpoch ?? 0
  if (epoch !== currentEpoch) {
    debug(
      `onAuthenticate: stale epoch doc=${documentName} current=${currentEpoch}`,
    )
    throw new Error("Stale editor epoch")
  }

  return { userId: userData.userId, canWrite, conversationId }
}

module.exports = { onAuthenticate }
