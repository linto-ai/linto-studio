const {
  getSpeakerLabels,
  getSpeakerLabel,
  createSpeakerLabel,
  updateSpeakerLabel,
  deleteSpeakerLabel,
  recomputeSpeakerLabel,
  deleteSpeakerLabelVoiceprint,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/speakerLabel.js`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getSpeakerLabels,
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/",
      method: "post",
      controller: createSpeakerLabel,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:labelId",
      method: "get",
      controller: getSpeakerLabel,
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:labelId",
      method: "patch",
      controller: updateSpeakerLabel,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:labelId",
      method: "delete",
      controller: deleteSpeakerLabel,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:labelId/recompute",
      method: "post",
      controller: recomputeSpeakerLabel,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
    {
      path: "/:labelId/voiceprint",
      method: "delete",
      controller: deleteSpeakerLabelVoiceprint,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
  ]
}
