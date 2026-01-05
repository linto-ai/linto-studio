const debug = require("debug")(
  "linto:conversation-manager:router:api:session:alias",
)

const { getAllSessionData } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/sessions.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/sessions/data/",
      method: "get",
      requireAuth: true,
      requireSessionOperator: true,
      controller: getAllSessionData,
    },
  ]
}
