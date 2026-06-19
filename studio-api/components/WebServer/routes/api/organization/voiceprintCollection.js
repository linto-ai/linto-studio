const {
  getVoiceprintCollections,
  getVoiceprintCollection,
  createVoiceprintCollection,
  updateVoiceprintCollection,
  deleteVoiceprintCollection,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/voiceprintCollection.js`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getVoiceprintCollections,
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/",
      method: "post",
      controller: createVoiceprintCollection,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:collectionId",
      method: "get",
      controller: getVoiceprintCollection,
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:collectionId",
      method: "patch",
      controller: updateVoiceprintCollection,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:collectionId",
      method: "delete",
      controller: deleteVoiceprintCollection,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
  ]
}
