const {
  getSpeakerLabels,
  getSpeakerLabel,
  createSpeakerLabel,
  updateSpeakerLabel,
  deleteSpeakerLabel,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/speakerLabel.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getSpeakerLabels,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/",
      method: "post",
      controller: createSpeakerLabel,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:labelId",
      method: "get",
      controller: getSpeakerLabel,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:labelId",
      method: "patch",
      controller: updateSpeakerLabel,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:labelId",
      method: "delete",
      controller: deleteSpeakerLabel,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
  ]
}
