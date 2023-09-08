const debug = require('debug')('linto:conversation-manager:router:api:taxonomy:conversation')

const {
  getOrganizationTags,
  getOrganizationCategory,
  createCategory,
  deleteTagFromConversation,
  addTagToConversation
} = require(`${process.cwd()}/components/WebServer/routecontrollers/taxonomy/conversation.js`)

const {
  addHighlight,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/tag.js`)


module.exports = (webserver) => {
  return [
    {
      path: '/organizations/:organizationId/tags,/conversation/:conversationId/tags',
      method: 'get',
      requireAuth: true,
      requireReadTaxonomyAccess: true,
      controller: getOrganizationTags
    },
    {
      path: '/organizations/:organizationId/categories,/conversation/:conversationId/categories',
      method: 'get',
      requireAuth: true,
      requireReadTaxonomyAccess: true,
      controller: getOrganizationCategory
    },
    {
      path: '/organizations/:organizationId/categories,/conversation/:conversationId/categories',
      method: 'post',
      requireAuth: true,
      requireReadTaxonomyAccess: true,
      controller: createCategory
    },
    {
      path: '/conversation/:conversationId/tags,/:conversationId/tags/:tagId',
      method: 'patch',
      requireAuth: true,
      requireWriteTaxonomyAccess: true,
      controller: addTagToConversation
    },
    {
      path: '/conversation/:conversationId/tags/:tagId',
      method: 'delete',
      requireAuth: true,
      requireWriteTaxonomyAccess: true,
      controller: deleteTagFromConversation
    },
    {
      path: '/conversation/:conversationId/highlights',
      method: 'post',
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: addHighlight
    },
  ]
}