const debug = require("debug")(
  "linto:conversation-manager:router:api:administration:activity",
)

const {
  getActivity,
  getKpiByRessource,
  getKpiBySession,
  generateSessionKpi,
  getSessionKpi,
  getKpi,
  generateKpi,
  generateOrgaKpi,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/activity.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/activity/",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: getActivity,
    },
    {
      path: "/activity/organization/:organizationId",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: getKpiByRessource,
    },
    {
      path: "/activity/session",
      method: "post",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: generateSessionKpi,
    },
    {
      path: "/activity/session",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: getSessionKpi,
    },
    {
      path: "/activity/session/:sessionId",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: getKpiBySession,
    },
    {
      path: "/activity/:interval",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: getKpi,
    },
    {
      path: "/activity/:interval",
      method: "post",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: generateKpi,
    },
    {
      path: "/activity/:interval/organization/:organizationId",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: generateOrgaKpi,
    },
  ]
}
