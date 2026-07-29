const debug = require("debug")(
  "linto:components:WebServer:routes:api:sessions:chat",
)

const {
  createSession,
  listSessions,
  getSession,
  updateSession,
  deleteSession,
  sendMessage,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/chat.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/:sessionId/chat/sessions",
      method: "post",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: createSession,
    },
    {
      path: "/:sessionId/chat/sessions",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: listSessions,
    },
    {
      path: "/:sessionId/chat/sessions/:chatSessionId",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: getSession,
    },
    {
      path: "/:sessionId/chat/sessions/:chatSessionId",
      method: "patch",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: updateSession,
    },
    {
      path: "/:sessionId/chat/sessions/:chatSessionId",
      method: "delete",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: deleteSession,
    },
    {
      path: "/:sessionId/chat/sessions/:chatSessionId/messages",
      method: "post",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: sendMessage,
    },
  ]
}
