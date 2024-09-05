const debug = require("debug")(
  "linto:conversation-manager:router:api:admin:users",
)
const { createSuperUser } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/users.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/user",
      method: "post",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: createSuperUser,
    },
  ]
}
