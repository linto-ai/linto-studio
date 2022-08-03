const debug = require('debug')('linto:conversation-manager:router:api:conversation:conversations')

const { // Create conversation based on file
    transcriptor
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/transcriptor.js`)

const { // Create conversation based on file
    deleteConversation,
    downloadConversation,
    getConversation,
    getUsersByConversation,
    lockConversation,
    searchConversation,
    updateConversation,
    updateConversationRights
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/conversation.js`)

module.exports = (webserver) => {
    return [
        // Create a conversation (upload 1 file)
        {
            path: '/create',
            method: 'post',
            requireAuth: true,
            controller: transcriptor
        },

        {
            path: '/search/:searchType',
            method: 'post',
            requireAuth: true,
            controller: searchConversation
        },


        /*Require Auth */
        {
            path: '/:conversationId/users',
            method: 'get',
            requireAuth: true,
            requireConversationShareAccess: true,
            controller: getUsersByConversation
        },
        {
            path: '/:conversationId/user/:userId',
            method: 'patch',
            requireAuth: true,
            requireConversationShareAccess: true,
            controller: updateConversationRights
        },
        {
            path: '/:conversationId/lock',
            method: 'post',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: lockConversation
        },
        {
            path: '/:conversationId',
            method: 'patch',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updateConversation
        },
        {
            path: '/:conversationId/download/:format',
            method: 'get',
            requireAuth: true,
            requireConversationReadAccess: true,
            controller: downloadConversation
        },
        {
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
        }
    ]
}