const debug = require("debug")(
  "linto:components:WebServer:routes:api:publication:publication",
)

const {
  getTemplates,
  getTemplatePlaceholders,
  exportWithTemplate,
  createTemplate,
  deleteTemplate,
  updateTemplateScope,
  downloadTemplate,
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
      requireEntitlement: "publication.custom_templates",
      controller: createTemplate,
    },
    {
      path: "/organizations/:organizationId/templates/:templateId",
      method: "delete",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireEntitlement: "publication.custom_templates",
      controller: deleteTemplate,
    },
    {
      path: "/organizations/:organizationId/templates/:templateId",
      method: "patch",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireEntitlement: "publication.custom_templates",
      controller: updateTemplateScope,
    },
    {
      path: "/organizations/:organizationId/templates/:templateId/download",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireEntitlement: "publication.docx_export",
      controller: downloadTemplate,
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
