const debug = require("debug")(
  "linto:conversation-manager:router:api:organizations:organizations",
)
const {
  createM2MPlatformUser,
  listM2MUser,
  getM2MTokens,
  refreshM2MToken,
  deleteM2Token,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/m2mUser.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/tokens",
      method: "post",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: createM2MPlatformUser,
    },
    {
      path: "/tokens",
      method: "get",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: listM2MUser,
    },
    {
      path: "/tokens/:tokenId",
      method: "get",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: getM2MTokens,
    },
    {
      path: "/tokens/:tokenId",
      method: "put",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: refreshM2MToken,
    },
    {
      path: "/tokens/:tokenId",
      method: "delete",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: deleteM2Token,
    },
  ]
}
