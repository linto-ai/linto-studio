const debug = require('debug')('linto:conversation-manager:router:api:conversation:conversations')

const {
    generateSubtitle,
    getSubtitle
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/subtitle.js`)


// Need to be conversationId to manage access right with the access middleware
module.exports = (webserver) => {
    return [
        /*Require Auth */
        {
            path: '/subtitle/:conversationId/generate',
            method: 'get',
            requireAuth: true,
            requireConversationReadAccess: true,
            controller: generateSubtitle
        },
        {
          path: '/subtitle/:conversationId',
          method: 'get',
          requireAuth: true,
          requireConversationReadAccess: true,
          controller: getSubtitle
      }
    ]
}