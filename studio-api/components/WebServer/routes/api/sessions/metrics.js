const debug = require("debug")(
  "linto:conversation-manager:router:api:session:links",
)
const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

const { getSessionMetric, getOrganizationMetric } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/metrics.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getOrganizationMetric,
      requireAuth: true,
      orgaPermissionAccess: PERMISSIONS.SESSION,
      requireOrganizationMeetingManagerAccess: true,
    },
    {
      path: "/sessions/:sessionId",
      method: "get",
      controller: getSessionMetric,
      requireAuth: true,
      orgaPermissionAccess: PERMISSIONS.SESSION,
      requireOrganizationQuickMeetingAccess: true,
    },
  ]
}
