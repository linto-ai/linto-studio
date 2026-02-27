const debug = require("debug")(
  "linto:components:WebServer:routes:api:organization:folders",
)

const {
  checkBody,
  listFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  moveConversations,
  listFolderConversations,
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
      middlewares: [checkBody],
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
      middlewares: [checkBody],
    },
    {
      path: "/:folderId",
      method: "delete",
      controller: deleteFolder,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
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
