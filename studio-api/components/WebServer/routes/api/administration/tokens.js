const debug = require("debug")(
  "linto:conversation-manager:router:api:organizations:token",
)
const {
  createApiKeyPlatform,
  listApiKey,
  getApiKey,
  refreshApiKey,
  deleteApiKey,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/apiKey.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/tokens",
      method: "post",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: createApiKeyPlatform,
    },
    {
      path: "/tokens",
      method: "get",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: listApiKey,
    },
    {
      path: "/tokens/:tokenId",
      method: "get",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: getApiKey,
    },
    {
      path: "/tokens/:tokenId",
      method: "put",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: refreshApiKey,
    },
    {
      path: "/tokens/:tokenId",
      method: "delete",
      requireAuth: true,
      requireSystemAdministrator: true,
      controller: deleteApiKey,
    },
  ]
}
