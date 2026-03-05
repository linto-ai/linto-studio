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
      controller: sendMessage,
    },
  ]
}
