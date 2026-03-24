const {
  getOptedInMembers,
  getOptedInMemberSamples,
  getOptedInMemberSampleAudio,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/optedInMembers.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getOptedInMembers,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:userId/voice-samples",
      method: "get",
      controller: getOptedInMemberSamples,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:userId/voice-samples/:sampleId/audio",
      method: "get",
      controller: getOptedInMemberSampleAudio,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
  ]
}
