const {
  listFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  moveConversation,
  listFolderConversations,
  uncategorizeConversations,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/folders.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: listFolders,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/",
      method: "post",
      controller: createFolder.bind(webserver),
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireFolderManagerAccess: true,
    },
    {
      path: "/uncategorized/conversations",
      method: "post",
      controller: uncategorizeConversations,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireFolderConversationWriteAccess: true,
    },
    {
      path: "/:folderId",
      method: "get",
      controller: getFolder,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:folderId",
      method: "patch",
      controller: updateFolder.bind(webserver),
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireFolderManagerAccess: true,
    },
    {
      path: "/:folderId",
      method: "delete",
      controller: deleteFolder.bind(webserver),
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireFolderManagerAccess: true,
      requireFolderConversationWriteAccess: true,
    },
    {
      path: "/:folderId/conversations/:conversationId",
      method: "post",
      controller: moveConversation,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireConversationWriteAccess: true,
    },
    {
      path: "/:folderId/conversations",
      method: "get",
      controller: listFolderConversations,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
  ]
}
