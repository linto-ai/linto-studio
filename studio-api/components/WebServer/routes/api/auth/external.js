const debug = require("debug")(
  "linto:components:WebServer:routes:api:auth:external",
)

const { resolveIdentity, exchangeToken } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/auth/external.js`,
)

/**
 * Mounted at /api/auth/external — the identity bridge for integrations.
 *
 * Auth: a SYSTEM_ADMINISTRATOR credential acting with `?userScope=backoffice`
 * (the only existing role that crosses organizations). No dedicated platform
 * role: the INTEGRATION bit is gone.
 */
module.exports = (webserver) => {
  return [
    {
      path: "/resolve",
      method: "post",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: resolveIdentity,
    },
    {
      path: "/token",
      method: "post",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: exchangeToken,
    },
  ]
}
