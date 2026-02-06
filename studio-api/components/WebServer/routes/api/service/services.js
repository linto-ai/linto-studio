const debug = require("debug")(
  "linto:components:WebServer:routes:api:service:services",
)

const { getSaasServices, getLlmServices } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/services/service.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "",
      method: "get",
      requireAuth: true,
      controller: getSaasServices,
    },
    {
      path: "/:organizationId/llm",
      method: "get",
      requireAuth: true,
      controller: getLlmServices,
    },
    {
      path: "/:scope",
      method: "get",
      requireAuth: true,
      controller: getSaasServices,
    },
  ]
}
