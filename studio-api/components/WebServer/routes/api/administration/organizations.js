const debug = require("debug")(
  "linto:conversation-manager:router:api:organizations:organizations",
)
const { listAllOrganization } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/organizations.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/organizations",
      method: "get",
      requireAuth: true,
      requireSessionOperator: true,
      controller: listAllOrganization,
    },
  ]
}
