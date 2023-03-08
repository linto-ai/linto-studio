const debug = require('debug')('linto:conversation-manager:router:api:conversation:taxonomy')

const { // Create conversation based on file
  addTag,
  deleteTag,
  addCategory,
  deleteCategory,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/taxonomy.js`)

module.exports = (webserver) => {
  return [
    {
      path: '/:conversationId/category/:categoryId',
      method: 'post',
      requireAuth: true,
      controller: addCategory
    },
    {
      path: '/:conversationId/category/:categoryId',
      method: 'delete',
      requireAuth: true,
      controller: deleteCategory
    },    
    {
      path: '/:conversationId/tag/:tagId',
      method: 'post',
      requireAuth: true,
      controller: addTag
    },
    {
      path: '/:conversationId/tag/:tagId',
      method: 'delete',
      requireAuth: true,
      controller: deleteTag
    },
  ]
}