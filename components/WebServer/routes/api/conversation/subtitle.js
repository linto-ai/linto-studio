const debug = require('debug')('linto:conversation-manager:router:api:conversation:conversations')

const {
    generateSubtitle,
    getSubtitle,
    deleteScreen,
    updateScreen,
    addScreen
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/subtitle.js`)


// Need to be conversationId to manage access right with the access middleware
module.exports = (webserver) => {
    return [
        /*Require Auth */
        {
            path: '/subtitle/:conversationId/generate',
            method: 'get',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: generateSubtitle
        },
        {
            path: '/subtitle/:conversationId/screen/:screenId',
            method: 'delete',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: deleteScreen
        },
        {
            path: '/subtitle/:conversationId/screen/:screenId',
            method: 'patch',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updateScreen
        },
        {
            path: '/subtitle/:conversationId/screen/:screenId',
            method: 'post',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: addScreen
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