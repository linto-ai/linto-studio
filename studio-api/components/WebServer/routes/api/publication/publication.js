const debug = require("debug")(
  "linto:components:WebServer:routes:api:publication:publication",
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
      path: "/organizations/:organizationId/templates",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: getTemplates,
    },
    {
      path: "/organizations/:organizationId/templates",
      method: "post",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: createTemplate,
    },
    {
      path: "/organizations/:organizationId/templates/:templateId",
      method: "delete",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: deleteTemplate,
    },
    {
      path: "/organizations/:organizationId/templates/:templateId/placeholders",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: getTemplatePlaceholders,
    },
    {
      path: "/conversations/:conversationId/jobs/:jobId/export/:format",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: exportWithTemplate,
    },
  ]
}
