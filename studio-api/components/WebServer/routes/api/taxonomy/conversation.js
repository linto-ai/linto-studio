const debug = require('debug')('linto:conversation-manager:router:api:taxonomy:conversation')

const {
  deleteTagFromConversation,
  addTagToConversation
} = require(`${process.cwd()}/components/WebServer/routecontrollers/taxonomy/conversation.js`)

const {
  addHighlight,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/tag.js`)


module.exports = (webserver) => {
  return [
    {
      path: '/conversations/:conversationId/tags',
      method: 'post',
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: addTagToConversation
    },
    {
      path: '/conversations/:conversationId/tags,/conversations/:conversationId/tags/:tagId',
      method: 'patch',
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: addTagToConversation
    },
    {
      path: '/conversations/:conversationId/tags/:tagId',
      method: 'delete',
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: deleteTagFromConversation
    },
    {
      path: '/conversations/:conversationId/turns/:turnId/highlights',
      method: 'post',
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: addHighlight
    },
  ]
}