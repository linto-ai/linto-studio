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
      path: '/:conversationId/tags',
      method: 'get',
      requireAuth: true,
      requireReadTaxonomyAccess: true,
      controller: getOrganizationTags
    },
    {
      path: '/:conversationId/categories',
      method: 'get',
      requireAuth: true,
      requireReadTaxonomyAccess: true,
      controller: getOrganizationCategory
    },
    {
      path: '/:conversationId/categories',
      method: 'post',
      requireAuth: true,
      requireReadTaxonomyAccess: true,
      controller: createCategory
    },
    {
      path: '/:conversationId/tags,/:conversationId/tags/:tagId',
      method: 'patch',
      requireAuth: true,
      requireWriteTaxonomyAccess: true,
      controller: addTagToConversation
    },
    {
      path: '/:conversationId/tags/:tagId',
      method: 'delete',
      requireAuth: true,
      requireWriteTaxonomyAccess: true,
      controller: deleteTagFromConversation
    },
    {
      path: '/:conversationId/highlights', 
      method: 'post',
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: addHighlight
    },
  ]
}