const {
  createUserVoiceSample,
  getUserVoiceSamples,
  getUserVoiceSampleAudio,
  deleteUserVoiceSample,
  deleteAllUserVoiceSamples,
  updateStorageMode,
  getUserVoiceOrganizations,
  updateVoiceOrganization,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/userVoiceOptIn.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/samples",
      method: "get",
      controller: getUserVoiceSamples,
      requireAuth: true,
    },
    {
      path: "/samples",
      method: "post",
      controller: createUserVoiceSample,
      requireAuth: true,
    },
    {
      path: "/samples",
      method: "delete",
      controller: deleteAllUserVoiceSamples,
      requireAuth: true,
    },
    {
      path: "/samples/:id/audio",
      method: "get",
      controller: getUserVoiceSampleAudio,
      requireAuth: true,
    },
    {
      path: "/samples/:id",
      method: "delete",
      controller: deleteUserVoiceSample,
      requireAuth: true,
    },
    {
      path: "/storage-mode",
      method: "patch",
      controller: updateStorageMode,
      requireAuth: true,
    },
    {
      path: "/organizations",
      method: "get",
      controller: getUserVoiceOrganizations,
      requireAuth: true,
    },
    {
      path: "/organizations/:orgId",
      method: "patch",
      controller: updateVoiceOrganization,
      requireAuth: true,
    },
  ]
}
