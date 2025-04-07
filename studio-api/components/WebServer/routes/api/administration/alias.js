const debug = require("debug")(
  "linto:conversation-manager:router:api:session:links",
)

const { getAllSessionAlias } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/alias.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/alias/",
      method: "get",
      requireAuth: true,
      requireSessionOperator: true,
      controller: getAllSessionAlias,
    },
  ]
}
