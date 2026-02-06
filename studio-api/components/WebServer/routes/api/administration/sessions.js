const debug = require("debug")(
  "linto:components:WebServer:routes:api:administration:sessions",
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
