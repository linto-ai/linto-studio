const debug = require('debug')('app:router:api:conversation:convo')
const { createConvoBase, getSpeakers, 
    createNewSpeaker, identifySpeaker, 
    deleteSpeaker,  combineSpeakerIds, 
    identifyTurnSpeaker, createNewTurnSpeaker} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/convo.js`)

module.exports = (webserver) => {
    return [{
            path: '/',
            method: 'post',
            requireAuth: false,
            controller: createConvoBase
            },
            {
            path: '/:conversationid/speakers',
            method: 'get',
            requireAuth: false,
            controller: getSpeakers
            },
            {
            path: '/:conversationid/speakers',
            method: 'post',
            requireAuth: false,
            controller: createNewSpeaker
            },
            {
            path: '/:conversationid/speakers/:speakerid',
            method: 'patch',
            requireAuth: false,
            controller: identifySpeaker
            },
            {
            path: '/:conversationid/speakers/:speakerid',
            method: 'delete',
            requireAuth: false,
            controller: deleteSpeaker
            },
            {
            path: '/:conversationid/turns/:speakerid',
            method: 'put',
            requireAuth: false,
            controller:  combineSpeakerIds
            },
            {
            path: '/:conversationid/turn/:speakerid',
            method: 'put',
            requireAuth: false,
            controller: identifyTurnSpeaker
            },
            {
            path: '/:conversationid/turn/:speakerid',
            method: 'post',
            requireAuth: false,
            controller:  createNewTurnSpeaker
            }
        ]
}