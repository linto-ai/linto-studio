const debug = require("debug")(
  "linto:conversation-manager:router:api:session:alias",
)

const { getAllSessionAlias } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/alias.js`,
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
