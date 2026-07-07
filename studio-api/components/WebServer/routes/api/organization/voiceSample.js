const {
  getVoiceSamples,
  getVoiceSample,
  getVoiceSampleAudio,
  createVoiceSample,
  deleteVoiceSample,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/speaker/voiceSample.js`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getVoiceSamples,
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/",
      method: "post",
      controller: createVoiceSample,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:voiceSampleId",
      method: "get",
      controller: getVoiceSample,
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:voiceSampleId/audio",
      method: "get",
      controller: getVoiceSampleAudio,
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:voiceSampleId",
      method: "delete",
      controller: deleteVoiceSample,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
  ]
}
