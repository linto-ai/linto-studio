const debug = require('debug')('linto:conversation-manager:router:api:keyword:keyword')
const {
  keywordExtract,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/keyword/keyword.js`)

module.exports = (webserver) => {
  return [
    {
      path: '/conversations/:conversationId/keyword',
      method: 'post',
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: keywordExtract
    },
  ]
}