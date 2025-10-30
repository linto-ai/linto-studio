const debug = require("debug")(
  "linto:conversation-manager:router:api:administration:activity",
)

const { getActivity } = require(
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
  ]
}
