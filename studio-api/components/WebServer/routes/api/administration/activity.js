const debug = require("debug")(
  "linto:conversation-manager:router:api:administration:activity",
)

const {
  getActivity,
  getKpiByActivity,
  getKpiBySession,
  generateKpi,
  generateDailyKpi,
  generateMonthlyKpi,
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
      path: "/activity/:activity/organization/:organizationId",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: getKpiByActivity,
    },
    {
      path: "/activity/session/:sessionId",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: getKpiBySession,
    },
    {
      path: "/activity/generate-kpi",
      method: "post",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: generateKpi,
    },
    {
      path: "/activity/organization/:organizationId/daily",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: generateDailyKpi,
    },
    {
      path: "/activity/organization/:organizationId/monthly",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: generateMonthlyKpi,
    },
  ]
}
