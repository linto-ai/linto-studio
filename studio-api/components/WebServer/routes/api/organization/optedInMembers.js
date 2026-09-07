const {
  getOptedInMembers,
  getOptedInMemberSamples,
  getOptedInMemberSampleAudio,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/speaker/optedInMembers.js`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getOptedInMembers,
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:userId/voice-samples",
      method: "get",
      controller: getOptedInMemberSamples,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:userId/voice-samples/:sampleId/audio",
      method: "get",
      controller: getOptedInMemberSampleAudio,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
  ]
}
