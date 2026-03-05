const {
  listFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  moveConversations,
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
      controller: createFolder,
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
      controller: updateFolder,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireFolderManagerAccess: true,
    },
    {
      path: "/:folderId",
      method: "delete",
      controller: deleteFolder,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      requireFolderManagerAccess: true,
    },
    {
      path: "/:folderId/conversations",
      method: "post",
      controller: moveConversations,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
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
