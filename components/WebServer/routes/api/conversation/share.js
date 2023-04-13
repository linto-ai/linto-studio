const debug = require('debug')('linto:conversation-manager:router:api:conversation:share')

const { // Create conversation based on file
  getRightsByConversation,
  updateConversationRights,
  listSharedConversation,
  inviteUserByEmail
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/share.js`)


module.exports = (webserver) => {
  return [
    {
      path: '/shared',
      method: 'get',
      requireAuth: true,
      controller: listSharedConversation
    },

    /*Require Conversation Access */
    {
      path: '/:conversationId/rights',
      method: 'get',
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: getRightsByConversation
    },
    {
      path: '/:conversationId/user/:userId',
      method: 'patch',
      requireAuth: true,
      requireConversationShareAccess: true,
      controller: updateConversationRights
    },
    {
      path: '/:conversationId/invite',
      method: 'post',
      requireAuth: true,
      requireConversationShareAccess: true,
      controller: inviteUserByEmail
    }
  ]
}