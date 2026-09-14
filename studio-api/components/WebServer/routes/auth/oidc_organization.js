const {
  resolveOrganizationSso,
  loginWithOrganizationSso,
  organizationSsoCallback,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/auth/organizationSso.js`,
)

// Bring your own SSO: the organization's OIDC provider, picked from the email
// domain. The session cookie is scoped to /auth/oidc (WebServer/index.js).
module.exports = (webServer) => {
  return [
    {
      path: "/oidc/organization/resolve",
      method: "post",
      requireAuth: false,
      controller: resolveOrganizationSso,
    },
    {
      path: "/oidc/organization/login",
      method: "get",
      requireAuth: false,
      controller: loginWithOrganizationSso,
    },
    {
      path: "/oidc/organization/cb",
      method: "get",
      requireAuth: false,
      controller: organizationSsoCallback,
    },
  ]
}
