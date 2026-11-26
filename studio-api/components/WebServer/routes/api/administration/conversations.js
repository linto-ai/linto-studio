const debug = require("debug")(
  "linto:components:WebServer:routes:api:administration:conversations",
)
const { deleteExpiredConversations } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/conversations.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/conversations/expired",
      method: "delete",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: deleteExpiredConversations,
    },
  ]
}
