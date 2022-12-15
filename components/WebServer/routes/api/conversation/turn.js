const debug = require('debug')('linto:conversation-manager:router:api:conversation:turn')

const {
    addTurn,
    deleteTurn,
    updateTurn,
    mergeTurn
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/turn.js`)

module.exports = (webserver) => {
    return [
        {
            path: '/:conversationId/turn/:turnId',
            method: 'post',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: addTurn
        },
        {
            path: '/:conversationId/turn/:turnId',
            method: 'delete',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: deleteTurn
        },
        {
            path: '/:conversationId/turn/:turnId',
            method: 'patch',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updateTurn
        },
        {
            path: '/:conversationId/turn/:turnId/merge/:direction',
            method: 'patch',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: mergeTurn
        }
    ]
}