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
    {
      path: "/organizations/:organizationId",
      method: "delete",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: listAllOrganization,
    },
    {
      path: "/organizations/:organizationId/users",
      method: "post",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: listAllOrganization,
    },
  ]
}
