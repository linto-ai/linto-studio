const { resolveIdentity, exchangeToken } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/auth/external.js`,
)
const { externalExchangeLimiter } = require(
  `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/resolve",
      method: "post",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: [externalExchangeLimiter, resolveIdentity],
    },
    {
      path: "/token",
      method: "post",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: [externalExchangeLimiter, exchangeToken],
    },
  ]
}
