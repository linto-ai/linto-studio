const debug = require("debug")(
  "linto:conversation-manager:router:api:session:links",
)

const {
  getSessionLinks,
  getSessionLinkById,
  createSessionLink,
  deleteSessionLink,
  updateSessionLink,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/links.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/links",
      method: "post",
      requireAuth: true,
      controller: createSessionLink,
    },
    {
      path: "/links/",
      method: "get",
      requireAuth: true,
      controller: getSessionLinks,
    },
    {
      path: "/links/:id",
      method: "get",
      requireAuth: true,
      controller: getSessionLinkById,
    },
    {
      path: "/links/:id",
      method: "delete",
      requireAuth: true,
      controller: deleteSessionLink,
    },
    {
      path: "/links/:id",
      method: "put",
      requireAuth: true,
      controller: updateSessionLink,
    },
  ]
}
