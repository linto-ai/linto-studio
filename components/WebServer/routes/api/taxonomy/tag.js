const debug = require('debug')('linto:conversation-manager:router:api:taxonomy:conversation')

const {
  getOrganizationTags,
  searchTag,
  getTag
} = require(`${process.cwd()}/components/WebServer/routecontrollers/taxonomy/tag.js`)

module.exports = (webserver) => {
  return [
    {
      path: '/organizations/:organizationId/tags,/conversations/:conversationId/tags',
      method: 'get',
      requireAuth: true,
      requireReadTaxonomyAccess: true,
      controller: getOrganizationTags
    },
    {
      path: '/organizations/:organizationId/tags/:tagId,/conversations/:conversationId/tags/:tagId',
      method: 'get',
      controller: getTag,
      requireAuth: true,
      requireReadTaxonomyAccess: true
    }
  ]
}