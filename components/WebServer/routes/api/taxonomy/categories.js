const debug = require('debug')('linto:conversation-manager:router:api:taxonomy:categories')

const {
  listConvCategoryByHighlight
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/categories.js`)

module.exports = (webserver) => {
  return [

    {
      path: '/:conversationId/categories/highlights',
      method: 'get',
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: listConvCategoryByHighlight
    }
    
  ]
}