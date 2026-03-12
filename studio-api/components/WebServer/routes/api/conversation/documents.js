const debug = require("debug")(
  "linto:components:WebServer:routes:api:conversation:documents",
)

const {
  uploadDocuments,
  listDocuments,
  downloadDocument,
  deleteDocument,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/documents.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/:conversationId/documents",
      method: "post",
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: uploadDocuments,
    },
    {
      path: "/:conversationId/documents",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: listDocuments,
    },
    {
      path: "/:conversationId/documents/:documentId",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: downloadDocument,
    },
    {
      path: "/:conversationId/documents/:documentId",
      method: "delete",
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: deleteDocument,
    },
  ]
}
