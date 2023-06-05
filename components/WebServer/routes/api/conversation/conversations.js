const debug = require('debug')('linto:conversation-manager:router:api:conversation:conversations')

const {
    deleteConversation,
    getConversation,
    getUsersByConversation,
    updateConversation,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/conversation.js`)

const {
    downloadConversation,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)


module.exports = (webserver) => {
    return [
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
            path: '/:conversationId/download',
            method: 'get',
            requireAuth: true,
            requireConversationReadAccess: true,
            controller: downloadConversation
        }
    ]
}