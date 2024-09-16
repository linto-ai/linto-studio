const debug = require("debug")(
  "linto:conversation-manager:router:api:admin:users",
)
const { createSuperUser, listAllUser, deleteUser, updateUser } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/users.js`,
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
    {
      path: "/user",
      method: "get",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: listAllUser,
    },
    {
      path: "/user/:userId",
      method: "delete",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: deleteUser,
    },
    {
      path: "/user/:userId",
      method: "patch",
      requireAuth: true,
      requireSuperAdmin: true,
      controller: updateUser,
    },
  ]
}
