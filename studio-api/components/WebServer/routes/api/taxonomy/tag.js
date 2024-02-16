const debug = require('debug')('linto:conversation-manager:router:api:taxonomy:conversation')

const {
  getTag,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/taxonomy/tags/tag.js`)


module.exports = (webserver) => {
  return [
    {
      path: '/organizations/:organizationId/tags/:tagId,/conversations/:conversationId/tags/:tagId',
      method: 'get',
      controller: getTag,
      requireAuth: true,
      requireReadTaxonomyAccess: true
    }
  ]
}