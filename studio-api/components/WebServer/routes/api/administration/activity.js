const debug = require("debug")(
  "linto:conversation-manager:router:api:administration:activity",
)

const {
  getActivity,
  getKpiByActivity,
  getKpiBySession,
  getDailyKpi,
  getMonthlyKpi,
  generateDailyKpi,
  generateMonthlyKpi,
  generateOrgaDailyKpi,
  generateOrgaMonthlyKpi,
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
      path: "/activity/organization/:organizationId/daily",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: generateOrgaDailyKpi,
    },
    {
      path: "/activity/organization/:organizationId/monthly",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: generateOrgaMonthlyKpi,
    },
    {
      path: "/activity/daily",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: getDailyKpi,
    },
    {
      path: "/activity/daily",
      method: "post",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: generateDailyKpi,
    },
    {
      path: "/activity/monthly",
      method: "post",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: generateMonthlyKpi,
    },
    {
      path: "/activity/monthly",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: getMonthlyKpi,
    },
  ]
}
