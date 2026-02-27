const debug = require("debug")("linto:components:WebServer:routes:routes")
const PROVIDER = require(`${process.cwd()}/lib/dao/oidc/provider`)

module.exports = (webServer) => {
  let api_routes = {
    "/": require("./root")(webServer),
    "/healthcheck": require("./api/healthcheck/healthcheck")(webServer),
    "/auth": [...require("./auth/index.js")(webServer)],
    "/api/users/self/favorites": require("./api/users/favorites.js")(webServer),
    "/api/users": require("./api/users/users.js")(webServer),
    "/api/organizations": require("./api/organization/organizations")(
      webServer,
    ),
    "/api/organizations/:organizationId/categories":
      require("./api/organization/categories")(webServer),
    "/api/organizations/:organizationId/tags":
      require("./api/organization/tag")(webServer),
    "/api/organizations/:organizationId/folders":
      require("./api/organization/folders")(webServer),
    "/api/conversations": [
      ...require("./api/conversation/share")(webServer),
      ...require("./api/conversation/conversations")(webServer),
      ...require("./api/conversation/turn")(webServer),
      ...require("./api/conversation/subtitle")(webServer),
    ],
    "/api": [
      ...require("./api/taxonomy/categories")(webServer), // Keep that way until frontend catches up
      ...require("./api/taxonomy/conversation")(webServer), // Keep that way until frontend catches up
      ...require("./api/taxonomy/tag")(webServer), // Keep that way until frontend catches up
      ...require("./api/media/media")(webServer),
      ...require("./api/taxonomy/metadata")(webServer),
    ],
    "/api/administration": [
      ...require("./api/administration/activity")(webServer),
      ...require("./api/administration/users")(webServer),
      ...require("./api/administration/organizations")(webServer),
      ...require("./api/administration/tokens")(webServer),
    ],
    "/api/nlp": require("./api/nlp/nlp")(webServer),
    "/api/services": require("./api/service/services")(webServer, this),
    "/api/publication": require("./api/publication/publication")(webServer),
  }

  let proxy_routes = []
  if (process.env.SESSION_API_ENDPOINT !== "") {
    proxy_routes.push(require("./proxy/sessions/session.js")(webServer))
    proxy_routes.push(require("./proxy/sessions/sessionAdmin.js")(webServer))

    /* Alias are api only on the studio side */
    api_routes["/api/organizations/:organizationId/sessions"] =
      require("./api/sessions/data.js")(webServer)
    api_routes["/api/administration"] = [
      ...api_routes["/api/administration"],
      ...require("./api/administration/sessions")(webServer),
    ]
  }

  const authProviders = PROVIDER.registerRoutes(webServer)
  api_routes["/auth"] = [...api_routes["/auth"], ...authProviders["/auth"]]

  return {
    api_routes: api_routes,
    proxy_routes: proxy_routes,
  }
}
