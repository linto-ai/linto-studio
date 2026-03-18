const {
  getSpeakerLabelCollections,
  getSpeakerLabelCollection,
  createSpeakerLabelCollection,
  updateSpeakerLabelCollection,
  deleteSpeakerLabelCollection,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/speakerLabelCollection.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getSpeakerLabelCollections,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/",
      method: "post",
      controller: createSpeakerLabelCollection,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:collectionId",
      method: "get",
      controller: getSpeakerLabelCollection,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:collectionId",
      method: "patch",
      controller: updateSpeakerLabelCollection,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:collectionId",
      method: "delete",
      controller: deleteSpeakerLabelCollection,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
  ]
}
