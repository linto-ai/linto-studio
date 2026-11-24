const {
  putUserEntitlement,
  deleteUserEntitlement,
  getUserEntitlement,
  putDomainEntitlement,
  getDomainEntitlement,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/entitlements.js`,
)

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
