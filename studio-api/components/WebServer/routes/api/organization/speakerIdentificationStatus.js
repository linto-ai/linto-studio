const { getSpeakerIdentificationStatus } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/speaker/speakerIdentificationStatus.js`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

module.exports = (webserver) => {
  return [
    {
      path: "/status",
      method: "get",
      controller: getSpeakerIdentificationStatus,
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.SPEAKER_IDENTIFICATION,
    },
  ]
}
