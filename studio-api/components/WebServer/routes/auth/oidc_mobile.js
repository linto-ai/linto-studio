const mobileSso = require(
  `${process.cwd()}/components/WebServer/routecontrollers/auth/mobileSso`,
)

// Shared by every SSO provider, so registered whichever ones are enabled.
module.exports = (webServer) => {
  return [
    {
      path: "/oidc/mobile/token",
      method: "post",
      requireAuth: false,
      controller: mobileSso.exchange,
    },
  ]
}
