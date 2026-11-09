const debug = require("debug")(
  "linto:components:WebServer:routes:api:sessions:catchup",
)

const { catchUp, catchUpStatus } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/catchup.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/public/:id/catchup",
      method: "post",
      requireAuth: false,
      controller: catchUp,
    },
    {
      path: "/public/:id/catchup/status",
      method: "get",
      requireAuth: false,
      controller: catchUpStatus,
    },
  ]
}
