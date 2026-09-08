const debug = require("debug")(
  "linto:components:WebServer:routes:api:auth:external",
)

const { exchangeToken } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/auth/external.js`,
)

// Mounted at /api/auth/external — the identity bridge for integrations.
module.exports = (webserver) => {
  return [
    {
      path: "/token",
      method: "post",
      requireAuth: true,
      requireIntegrationAccess: true,
      controller: exchangeToken,
    },
  ]
}
