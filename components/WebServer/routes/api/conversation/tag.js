const debug = require('debug')('linto:conversation-manager:router:api:conversation:taxonomy')

const { // Create conversation based on file
  addTag,
  deleteTag,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/tag.js`)

module.exports = (webserver) => {
  return [

    {
      path: '/:conversationId/tags/:tagId',
      method: 'post',
      requireAuth: true,
      controller: addTag
    },
    {
      path: '/:conversationId/tags/:tagId',
      method: 'delete',
      requireAuth: true,
      controller: deleteTag
    },
  ]
}