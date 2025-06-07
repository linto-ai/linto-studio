const debug = require("debug")("linto:router:api:monitoring:metrics")
const {
  startWebsocketConnection,
  endWebsocketConnection,
  getMediaCount,
  getWebsocketStats,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/monitoring/metrics.js`,
)

module.exports = (webserver) => [
  {
    path: "/websocket/start",
    method: "post",
    controller: startWebsocketConnection,
  },
  {
    path: "/websocket/:id/end",
    method: "patch",
    controller: endWebsocketConnection,
  },
  {
    path: "/organizations/:organizationId/media-count",
    method: "get",
    requireAuth: true,
    requireOrganizationMemberAccess: true,
    controller: getMediaCount,
  },
  {
    path: "/organizations/:organizationId/websocket",
    method: "get",
    requireAuth: true,
    requireOrganizationMemberAccess: true,
    controller: getWebsocketStats,
  },
]
