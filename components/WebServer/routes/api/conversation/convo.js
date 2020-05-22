const debug = require('debug')('app:router:api:conversation:convo')
const { createConvoBase, getSpeakers, createNewSpeaker, identifySpeaker, deleteSpeaker,  combineSpeakerIds} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/convo.js`)

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
            method: 'patch',
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
            path: '/:conversationid/speakers/:speakerid',
            method: 'put',
            requireAuth: false,
            controller:  combineSpeakerIds
            }
        ]
}