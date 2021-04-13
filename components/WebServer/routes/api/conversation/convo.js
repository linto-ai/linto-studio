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
            path: '/create', //TODO: Need to be renamed
            method: 'post',
            requireAuth: false,
            controller: audioUpload
        }, {
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
            path: '/:conversationid/mergespeakers/:speakerid', 
            method: 'patch',
            requireAuth: false,
            controller: [combineSpeakerIds, deleteSpeaker]
        },
        {
            path: '/:conversationid/turnspeaker/:turnid', 
            method: 'put',
            requireAuth: false,
            controller: identifyTurnSpeaker
        },
        {
            path: '/:conversationid/turn/:speakerid', 
            method: 'post',
            requireAuth: false,
            controller: [createTurn, renumberTurns]
        },
        {
            path: '/:conversationid/turn', 
            method: 'delete',
            requireAuth: false,
            controller: [deleteTurns, renumberTurns] 
        },
        {
            path: '/:conversationid/turn/merge', 
            method: 'patch',
            requireAuth: false,
            controller: [mergeTurns, renumberTurns]
        },
        {
            path: '/:conversationid/turn/split', 
            method: 'put',
            requireAuth: false,
            controller: [splitTurns, renumberTurns]
        },
        {
            path: '/:conversationid/replaceturn/:turnid',
            method: 'patch',
            requireAuth: false,
            controller: replaceTurnText
        },
        {
            path: '/:conversationid/text', 
            method: 'put',
            requireAuth: false,
            controller: updateAllText
        }
    ]
}