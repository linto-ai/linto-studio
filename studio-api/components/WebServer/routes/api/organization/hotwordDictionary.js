const {
  getHotwordDictionaries,
  createHotwordDictionary,
  updateHotwordDictionary,
  deleteHotwordDictionary,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/hotwordDictionary.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getHotwordDictionaries,
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
    },
    {
      path: "/",
      method: "post",
      controller: createHotwordDictionary,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:dictionaryId",
      method: "patch",
      controller: updateHotwordDictionary,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
    {
      path: "/:dictionaryId",
      method: "delete",
      controller: deleteHotwordDictionary,
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
    },
  ]
}
