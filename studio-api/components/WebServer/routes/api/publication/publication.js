const debug = require("debug")(
  "linto:conversation-manager:router:api:publication",
)

const {
  getTemplates,
  getTemplatePlaceholders,
  exportWithTemplate,
  createTemplate,
  deleteTemplate,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/templates",
      method: "get",
      requireAuth: true,
      controller: getTemplates,
    },
    {
      path: "/templates",
      method: "post",
      requireAuth: true,
      controller: createTemplate,
    },
    {
      path: "/templates/:templateId",
      method: "delete",
      requireAuth: true,
      controller: deleteTemplate,
    },
    {
      path: "/templates/:templateId/placeholders",
      method: "get",
      requireAuth: true,
      controller: getTemplatePlaceholders,
    },
    {
      path: "/:jobId/export/:format",
      method: "get",
      requireAuth: true,
      controller: exportWithTemplate,
    },
  ]
}
