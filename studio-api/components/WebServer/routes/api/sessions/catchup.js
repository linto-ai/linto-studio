const debug = require("debug")(
  "linto:components:WebServer:routes:api:sessions:catchup",
)

const { catchUp, catchUpStatus } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/catchup.js`,
)

const catchUpOrg = (req) => req.liveSession?.organizationId

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "post",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireOrganizationSession: true,
      requireEntitlement: {
        capability: "ai.chat",
        value: 1,
        orgFrom: catchUpOrg,
      },
      controller: catchUp,
    },
    {
      path: "/status",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireOrganizationSession: true,
      controller: catchUpStatus,
    },
  ]
}
