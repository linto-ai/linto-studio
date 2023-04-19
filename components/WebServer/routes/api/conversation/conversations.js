const debug = require('debug')('linto:conversation-manager:router:api:conversation:conversations')

const { // Create conversation based on file
    deleteConversation,
    downloadConversation,
    getConversation,
    getUsersByConversation,
    searchConversation,
    updateConversation,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/conversation.js`)

module.exports = (webserver) => {
    return [
        {
            path: '/search',
            method: 'get',
            requireAuth: true,
            controller: searchConversation
        },

        /*Require Auth */
        {
            path: '/:conversationId',
            method: 'patch',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updateConversation
        }, {
            path: '/:conversationId',
            method: 'get',
            requireAuth: true,
            requireConversationReadAccess: true,
            controller: getConversation
        },
        {
            path: '/:conversationId',
            method: 'delete',
            requireAuth: true,
            requireConversationDeleteAccess: true,
            controller: deleteConversation
        },
        {
            path: '/:conversationId/users',
            method: 'get',
            requireAuth: true,
            requireConversationReadAccess: true,
            controller: getUsersByConversation
        },
        {
            path: '/:conversationId/download/:format',
            method: 'get',
            requireAuth: true,
            requireConversationReadAccess: true,
            controller: downloadConversation
        }
    ]
}