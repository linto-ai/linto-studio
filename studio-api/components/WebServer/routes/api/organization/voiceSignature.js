const {
  getVoiceSignatures,
  getVoiceSignature,
  getVoiceSignatureAudio,
  createVoiceSignature,
  updateVoiceSignature,
  deleteVoiceSignature,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/voiceSignature.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getVoiceSignatures,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/",
      method: "post",
      controller: createVoiceSignature,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:voiceSignatureId",
      method: "get",
      controller: getVoiceSignature,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:voiceSignatureId/audio",
      method: "get",
      controller: getVoiceSignatureAudio,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:voiceSignatureId",
      method: "patch",
      controller: updateVoiceSignature,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:voiceSignatureId",
      method: "delete",
      controller: deleteVoiceSignature,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
  ]
}
