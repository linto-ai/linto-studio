const debug = require("debug")(
  "linto:components:WebServer:routes:api:sessions:catchup",
)

const { catchUp, catchUpStatus } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/catchup.js`,
)

const catchUpOrg = (req) => req.liveSession?.organizationId
const AI_CHAT = { capability: "ai.chat", value: 1, orgFrom: catchUpOrg }

module.exports = (webserver) => {
  return {
    // under /api/organizations/:organizationId/sessions
    organization: [
      {
        path: "/:id/catchup",
        method: "post",
        requireAuth: true,
        requireOrganizationMemberAccess: true,
        requireOrganizationSession: true,
        requireEntitlement: AI_CHAT,
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
    ],
    // under /api/sessions, publicSessionToken only
    public: [
      {
        path: "/public/:id/catchup",
        method: "post",
        requireAuth: false,
        requirePublicSessionToken: true,
        requireEntitlement: AI_CHAT,
        controller: catchUp,
      },
      {
        path: "/public/:id/catchup/status",
        method: "get",
        requireAuth: false,
        requirePublicSessionToken: true,
        controller: catchUpStatus,
      },
    ],
  }
}
