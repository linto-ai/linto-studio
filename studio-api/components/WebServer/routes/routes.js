const debug = require("debug")("linto:webserver:routes")

module.exports = (webServer) => {
  let routes = {
    "/": require("./root")(webServer),
    "/healthcheck": require("./api/healthcheck/healthcheck")(webServer),
    "/auth": require("./auth")(webServer),
    "/api/users/self/favorites": require("./api/users/favorites.js")(webServer),
    "/api/users": require("./api/users/users.js")(webServer),
    "/api/organizations": require("./api/organization/organizations")(
      webServer,
    ),
    "/api/organizations/:organizationId/categories":
      require("./api/organization/categories")(webServer),
    "/api/organizations/:organizationId/tags":
      require("./api/organization/tag")(webServer),
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
    "/api/nlp": require("./api/nlp/nlp")(webServer),
    "/api/services": require("./api/service/services")(webServer, this),
  }

  if (process.env.ENABLE_SESSION_API === "true") {
    routes["/api/organizations/:organizationId/delivery"] =
      require("./session/delivery/index.js")(webServer)
    routes["/api"] = [
      ...routes["/api"],
      ...require("./session/session-manager/index.js")(webServer),
    ]
  }

  return routes
}
