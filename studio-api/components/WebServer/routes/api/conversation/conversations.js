const debug = require('debug')('linto:conversation-manager:router:api:conversation:conversations')

const {
    deleteConversation,
    getConversation,
    getUsersByConversation,
    updateConversation,
    getUsersByConversationList
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/conversation.js`)

const {
    exportConversation,
    listExport
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

module.exports = (webserver) => {
    return [
        /*Require Auth */
        {
            path: '/users',
            method: 'post',
            requireAuth: true,
            controller: getUsersByConversationList
        },
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
            method: 'post',
            requireAuth: true,
            requireConversationReadAccess: true,
            controller: exportConversation
        },
        {
            path: '/:conversationId/export/list',
            method: 'get',
            requireAuth: true,
            requireConversationReadAccess: true,
            controller: listExport
        }
    ]
}