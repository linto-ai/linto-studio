const debug = require("debug")(
  "linto:components:WebServer:routes:api:v1:entitlements",
)

const {
  putUserEntitlement,
  deleteUserEntitlement,
  getUserEntitlement,
  putDomainEntitlement,
  getDomainEntitlement,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/entitlements.js`,
)

/**
 * Mounted at /api/v1/organizations/:organizationId/entitlements — the
 * versioned surface an external billing system calls (contract v1,
 * `docs-twake/contrat-api-entitlements.md`). Only these routes are versioned.
 *
 * Auth: an API key that is ADMIN (6) of the root organization. `PUT domains`
 * also creates the organization of the domain, so it additionally requires the
 * platform role ORGANIZATION_INITIATOR (2). No new role, no new scope.
 */
module.exports = (webserver) => {
  return [
    {
      path: "/users/:email",
      method: "put",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: putUserEntitlement,
    },
    {
      path: "/users/:email",
      method: "delete",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: deleteUserEntitlement,
    },
    {
      path: "/users/:email",
      method: "get",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: getUserEntitlement,
    },
    {
      path: "/domains/:domain",
      method: "put",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      requireOrganizationInitiatorAccess: true,
      controller: putDomainEntitlement,
    },
    {
      path: "/domains/:domain",
      method: "get",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: getDomainEntitlement,
    },
  ]
}
