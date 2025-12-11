const debug = require("debug")(
  "linto:conversation-manager:router:api:conversation:conversations",
)

const {
  deleteConversation,
  getConversation,
  getUsersByConversation,
  updateConversation,
  getUsersByConversationList,
  getChildConversation,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/conversation.js`,
)

const {
  exportConversation,
  listExport,
  updateExportResult,
  listExportVersions,
  getExportVersion,
  restoreExportVersion,
  generateExportDocument,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

module.exports = (webserver) => {
  return [
    /*Require Auth */
    {
      path: "/users",
      method: "post",
      requireAuth: true,
      controller: getUsersByConversationList,
    },
    {
      path: "/:conversationId",
      method: "patch",
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: updateConversation,
    },
    {
      path: "/:conversationId",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: getConversation,
    },
    {
      path: "/:conversationId",
      method: "delete",
      requireAuth: true,
      requireConversationDeleteAccess: true,
      controller: deleteConversation,
    },
    {
      path: "/:conversationId/users",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: getUsersByConversation,
    },
    {
      path: "/:conversationId/download",
      method: "post",
      requireAuth: true,
      requireConversationReadAccess: true,
      orgaPermissionAccess: PERMISSIONS.SUMMARY,
      controller: exportConversation,
    },
    {
      path: "/:conversationId/export/list",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: listExport,
    },
    {
      path: "/:conversationId/child",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: getChildConversation,
    },
    // Versioning routes - proxy to LLM Gateway
    // Update job result (creates new version in LLM Gateway)
    {
      path: "/:conversationId/export/:jobId/result",
      method: "put",
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: updateExportResult,
    },
    // List all versions for a job
    {
      path: "/:conversationId/export/:jobId/versions",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: listExportVersions,
    },
    // Get specific version
    {
      path: "/:conversationId/export/:jobId/versions/:versionNumber",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: getExportVersion,
    },
    // Restore a specific version
    {
      path: "/:conversationId/export/:jobId/versions/:versionNumber/restore",
      method: "post",
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: restoreExportVersion,
    },
    // Generate document (PDF/DOCX) from job result
    {
      path: "/:conversationId/export/:jobId/document",
      method: "post",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: generateExportDocument,
    },
  ]
}
