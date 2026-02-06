const debug = require("debug")(
  "linto:components:WebServer:routes:api:sessions:data",
)

const {
  getSessionData,
  getSessionDataById,
  createSessionData,
  deleteSessionData,
  updateSessionData,
  removePasswordFromSessionData,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/data.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/data",
      method: "post",
      requireAuth: true,
      controller: createSessionData,
    },
    {
      path: "/data/",
      method: "get",
      requireAuth: true,
      controller: getSessionData,
    },
    {
      path: "/data/:id",
      method: "get",
      requireAuth: true,
      controller: getSessionDataById,
    },
    {
      path: "/data/:id",
      method: "delete",
      requireAuth: true,
      controller: deleteSessionData,
    },
    {
      path: "/data/:id",
      method: "put",
      requireAuth: true,
      controller: updateSessionData,
    },
    {
      path: "/data/:id/password",
      method: "delete",
      requireAuth: true,
      controller: removePasswordFromSessionData,
    },
  ]
}
