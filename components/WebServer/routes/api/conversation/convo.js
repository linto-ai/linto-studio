const debug = require('debug')('app:router:api:conversation:convo')
const { createConvoBase, getSpeakers, identifySpeaker} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/convo.js`)

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
            path: '/:conversationid/speakers/:speakerid',
            method: 'patch',
            requireAuth: false,
            controller: identifySpeaker
            }
        ]
}