const debug = require("debug")(
  "linto:components:WebServer:routes:api:conversation:chat",
)

const {
  createSession,
  listSessions,
  getSession,
  deleteSession,
  updateSession,
  sendMessage,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/chat.js`,
)

const model = require(`${process.cwd()}/lib/mongodb/models`)

// SaaS: the chat session carries the organization the message is billed to.
const chatOrg = async (req) => {
  const sessions = await model.chatSessions.getById(req.params.sessionId)
  return sessions && sessions[0] ? sessions[0].organizationId : null
}

module.exports = (webserver) => {
  return [
    {
      path: "/:conversationId/chat/sessions",
      method: "post",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: createSession,
    },
    {
      path: "/:conversationId/chat/sessions",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: listSessions,
    },
    {
      path: "/:conversationId/chat/sessions/:sessionId",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: getSession,
    },
    {
      path: "/:conversationId/chat/sessions/:sessionId",
      method: "patch",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: updateSession,
    },
    {
      path: "/:conversationId/chat/sessions/:sessionId",
      method: "delete",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: deleteSession,
    },
    {
      path: "/:conversationId/chat/sessions/:sessionId/messages",
      method: "post",
      requireAuth: true,
      requireConversationReadAccess: true,
      requireEntitlement: { capability: "ai.chat", value: 1, orgFrom: chatOrg },
      controller: sendMessage,
    },
  ]
}
