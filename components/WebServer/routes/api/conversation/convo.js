const debug = require('debug')('app:router:api:conversation:convo')

// Speakers
const {
    combineSpeakerIds,
    createNewSpeaker,
    deleteSpeaker,
    identifySpeaker,
    getSpeakers
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/speakers.js`)

// Turns
const {
    //createNewTurnSpeaker,
    createTurn,
    deleteTurns,
    identifyTurnSpeaker,
    mergeTurns,
    renumberTurns,
    splitTurns
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/turns.js`)

const {
    createConvoBase,
    updateSpeakerAudio,
    replaceTurnText
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/convo.js`)

const {
    updateAllText
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/textedit.js`)

const { // Create conversation based on file
    audioUpload
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/file.js`)


module.exports = (webserver) => {
    return [{
            path: '/create',
            method: 'post',
            requireAuth: true,
            controller: audioUpload
        }, {
            path: '/',
            method: 'post',
            requireAuth: true,
            controller: createConvoBase
        },
        {
            path: '/:conversationid/speakers',
            method: 'get',
            requireAuth: true,
            controller: getSpeakers
        },
        {
            path: '/:conversationid/speakers',
            method: 'post',
            requireAuth: true,
            controller: createNewSpeaker
        },
        {
            path: '/:conversationid/speakers/:speakerid',
            method: 'patch',
            requireAuth: true,
            controller: identifySpeaker
        },
        {
            path: '/:conversationid/speakers/:speakerid',
            method: 'delete',
            requireAuth: true,
            controller: deleteSpeaker
        },
        {
            path: '/:conversationid/mergespeakers/:speakerid',
            method: 'patch',
            requireAuth: true,
            controller: [combineSpeakerIds, deleteSpeaker]
        },
        {
            path: '/:conversationid/turnspeaker/:turnid',
            method: 'put',
            requireAuth: true,
            controller: identifyTurnSpeaker
        },
        {
            path: '/:conversationid/turn/:speakerid',
            method: 'post',
            requireAuth: true,
            controller: [createTurn, renumberTurns]
        },
        {
            path: '/:conversationid/turn',
            method: 'delete',
            requireAuth: true,
            controller: [deleteTurns, renumberTurns]
        },
        {
            path: '/:conversationid/turn/merge',
            method: 'patch',
            requireAuth: true,
            controller: [mergeTurns, renumberTurns]
        },
        {
            path: '/:conversationid/turn/split',
            method: 'put',
            requireAuth: true,
            controller: [splitTurns, renumberTurns]
        },
        {
            path: '/:conversationid/replaceturn/:turnid',
            method: 'patch',
            requireAuth: true,
            controller: replaceTurnText
        },
        {
            path: '/:conversationid/text',
            method: 'put',
            requireAuth: true,
            controller: updateAllText
        }
    ]
}