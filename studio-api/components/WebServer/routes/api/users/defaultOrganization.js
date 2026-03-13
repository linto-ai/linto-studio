const {
  setDefaultOrganization,
  unsetDefaultOrganization,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/defaultOrganization.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "put",
      requireAuth: true,
      controller: setDefaultOrganization,
    },
    {
      path: "/",
      method: "delete",
      requireAuth: true,
      controller: unsetDefaultOrganization,
    },
  ]
}
