const debug = require("debug")(
  "linto:conversation-manager:router:api:session:links",
)

const {
  getSessionData,
  getSessionDataById,
  createSessionData,
  deleteSessionData,
  updateSessionData,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/data.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/alias",
      method: "post",
      requireAuth: true,
      controller: createSessionData,
    },
    {
      path: "/alias/",
      method: "get",
      requireAuth: true,
      controller: getSessionData,
    },
    {
      path: "/alias/:id",
      method: "get",
      requireAuth: true,
      controller: getSessionDataById,
    },
    {
      path: "/alias/:id",
      method: "delete",
      requireAuth: true,
      controller: deleteSessionData,
    },
    {
      path: "/alias/:id",
      method: "put",
      requireAuth: true,
      controller: updateSessionData,
    },
  ]
}
