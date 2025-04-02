const debug = require("debug")(
  "linto:conversation-manager:router:api:session:links",
)

const {
  getSessionAlias,
  getSessionAliasById,
  createSessionAlias,
  deleteSessionAlias,
  updateSessionAlias,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/alias.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/alias",
      method: "post",
      requireAuth: true,
      controller: createSessionAlias,
    },
    {
      path: "/alias/",
      method: "get",
      requireAuth: true,
      controller: getSessionAlias,
    },
    {
      path: "/alias/:id",
      method: "get",
      requireAuth: true,
      controller: getSessionAliasById,
    },
    {
      path: "/alias/:id",
      method: "delete",
      requireAuth: true,
      controller: deleteSessionAlias,
    },
    {
      path: "/alias/:id",
      method: "put",
      requireAuth: true,
      controller: updateSessionAlias,
    },
  ]
}
