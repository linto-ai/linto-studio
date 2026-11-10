const debug = require("debug")(
  "linto:components:WebServer:routes:api:sessions:catchup",
)

const { catchUp, catchUpStatus } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/catchup.js`,
)

const catchUpOrg = (req) => req.liveSession?.organizationId

// under /api/organizations/:organizationId/sessions
module.exports = (webserver) => {
  return [
    {
      path: "/:id/catchup",
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
      path: "/:id/catchup/status",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireOrganizationSession: true,
      controller: catchUpStatus,
    },
  ]
}
