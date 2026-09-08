const debug = require("debug")(
  "linto:components:WebServer:routes:api:organization:externalDomains",
)

const {
  listExternalDomains,
  getExternalDomain,
  upsertExternalDomain,
  deleteExternalDomain,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/externalDomains.js`,
)

// Mounted at /api/organizations/:organizationId/external-domains — org admin
// only (the Twake bridge key is an admin of the Twake organization).
module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: listExternalDomains,
    },
    {
      path: "/:domain",
      method: "get",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: getExternalDomain,
    },
    {
      path: "/:domain",
      method: "put",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: upsertExternalDomain,
    },
    {
      path: "/:domain",
      method: "delete",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: deleteExternalDomain,
    },
  ]
}
