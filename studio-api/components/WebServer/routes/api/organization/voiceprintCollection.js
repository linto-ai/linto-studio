const {
  getVoiceprintCollections,
  getVoiceprintCollection,
  createVoiceprintCollection,
  updateVoiceprintCollection,
  deleteVoiceprintCollection,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/voiceprintCollection.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getVoiceprintCollections,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/",
      method: "post",
      controller: createVoiceprintCollection,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:collectionId",
      method: "get",
      controller: getVoiceprintCollection,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:collectionId",
      method: "patch",
      controller: updateVoiceprintCollection,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:collectionId",
      method: "delete",
      controller: deleteVoiceprintCollection,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
  ]
}
