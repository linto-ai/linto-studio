const {
  getOptedInMembers,
  getOptedInMemberSignatures,
  getOptedInMemberSignatureAudio,
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
      path: "/:userId/voice-signatures",
      method: "get",
      controller: getOptedInMemberSignatures,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:userId/voice-signatures/:sigId/audio",
      method: "get",
      controller: getOptedInMemberSignatureAudio,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
  ]
}
