const {
  createUserVoiceSignature,
  getUserVoiceSignatures,
  getUserVoiceSignatureAudio,
  deleteUserVoiceSignature,
  deleteAllUserVoiceSignatures,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/userVoiceOptIn.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/voice-signatures",
      method: "get",
      controller: getUserVoiceSignatures,
      requireAuth: true,
    },
    {
      path: "/voice-signatures",
      method: "post",
      controller: createUserVoiceSignature,
      requireAuth: true,
    },
    {
      path: "/voice-signatures",
      method: "delete",
      controller: deleteAllUserVoiceSignatures,
      requireAuth: true,
    },
    {
      path: "/voice-signatures/:id/audio",
      method: "get",
      controller: getUserVoiceSignatureAudio,
      requireAuth: true,
    },
    {
      path: "/voice-signatures/:id",
      method: "delete",
      controller: deleteUserVoiceSignature,
      requireAuth: true,
    },
  ]
}
