const debug = require("debug")("linto:conversation-manager:router:api:tag:tag")

const { createTag, updateTag, deleteTag, getTags, checkBody } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/taxonomy/tags/tag.js`,
)

const { searchTag } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/taxonomy/tags/search.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      controller: getTags,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/",
      method: "post",
      controller: createTag,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      middlewares: [checkBody],
    },
    {
      path: "/search",
      method: "get",
      controller: searchTag,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
    {
      path: "/:tagId",
      method: "patch",
      controller: updateTag,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      middlewares: [checkBody],
    },
    {
      path: "/:tagId",
      method: "delete",
      controller: deleteTag,
      requireAuth: true,
      requireOrganizationMemberAccess: true,
    },
  ]
}
