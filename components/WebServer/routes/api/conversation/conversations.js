const debug = require('debug')('app:router:api:conversation:conversations')

const { // Create conversation based on file
    transcriptor
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/transcriptor.js`)

const { // Create conversation based on file
    getOwnerConversation,
    getConversation,
    listConversation,
    updateConversation,
    searchText,
    deleteConversation,
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
            path: '/list',
            method: 'get',
            requireAuth: true,
            controller: listConversation
        },
        {
            path: '/search/text',
            method: 'post',
            requireAuth: true,
            controller: searchText
        },


        /*Require Auth */
        {
            path: '/:conversationId/user/:userId',
            method: 'patch',
            requireAuth: true,
            requireConversationShareAccess: true,
            controller: updateConversationRights
        },
        {
            path: '/:conversationId',
            method: 'patch',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updateConversation
        },
        {
            path: '/',
            method: 'get',
            requireAuth: true,
            requireConversationOwnerAccess: true,
            controller: getOwnerConversation
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