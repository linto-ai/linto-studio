const {
  getVoiceSamples,
  getVoiceSample,
  getVoiceSampleAudio,
  createVoiceSample,
  deleteVoiceSample,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/voiceSample.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getVoiceSamples,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/",
      method: "post",
      controller: createVoiceSample,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:voiceSampleId",
      method: "get",
      controller: getVoiceSample,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:voiceSampleId/audio",
      method: "get",
      controller: getVoiceSampleAudio,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:voiceSampleId",
      method: "delete",
      controller: deleteVoiceSample,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
  ]
}
