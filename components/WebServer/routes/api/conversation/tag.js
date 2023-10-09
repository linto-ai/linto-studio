const debug = require('debug')('linto:conversation-manager:router:api:conversation:taxonomy')

const {
  addTag,
  deleteTag,
  addHighlight,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/tag.js`)

module.exports = (webserver) => {
  return [

    {
      path: '/:conversationId/tags/:tagId',
      method: 'post',
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: addTag
    },
    {
      path: '/:conversationId/tags/:tagId',
      method: 'delete',
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: deleteTag
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