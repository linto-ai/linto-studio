const debug = require('debug')('app:router:api:conversation:conversations')

const { // Create conversation based on file
    transcriptor
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/transcriptor.js`)

const { // Create conversation based on file
  getOwnerConversation
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/conversation.js`)

module.exports = (webserver) => {
    return [{
            // Create a conversation (upload 1 file)
            path: '/create',
            method: 'post',
            requireAuth: true,
            controller: transcriptor
        },
        {
            path: '/:conversationid',
            method: 'get',
            requireAuth: true,
            requireConversationOwnerAccess: true,
            controller: getOwnerConversation
        }
    ]
}