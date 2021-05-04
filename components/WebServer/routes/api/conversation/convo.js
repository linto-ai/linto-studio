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
    deleteConvo
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/convo.js`)

const {
    replaceTurnText
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/textedit.js`)

const {
    updatehighlightwords,
    updatehighlighttype, 
    createhighlight, 
    deletehighlight
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/annotations.js`)

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
        },{
            path: '/',
            method: 'delete',
            requireAuth: true,
            requireOwnerAccess: true,
            controller: deleteConvo
        },
        {
            path: '/:conversationid/speakers',
            method: 'get',
            requireAuth: true,
            requireReadAccess: true,
            controller: getSpeakers
        },
        {
            path: '/:conversationid/speakers',
            method: 'post',
            requireAuth: true,
            requireWriteAccess: true,
            controller: createNewSpeaker
        },
        {
            path: '/:conversationid/speakers/:speakerid',
            method: 'patch',
            requireAuth: true,
            requireWriteAccess: true,
            controller: identifySpeaker
        },
        {
            path: '/:conversationid/speakers/:speakerid',
            method: 'delete',
            requireAuth: true,
            requireWriteAccess: true,
            controller: deleteSpeaker
        },
        {
            path: '/:conversationid/mergespeakers/:speakerid',
            method: 'patch',
            requireAuth: true,
            requireWriteAccess: true,
            controller: [combineSpeakerIds, deleteSpeaker]
        },
        {
            path: '/:conversationid/turnspeaker/:turnid',
            method: 'put',
            requireAuth: true,
            requireWriteAccess: true,
            controller: identifyTurnSpeaker
        },
        {
            path: '/:conversationid/turn/:speakerid',
            method: 'post',
            requireAuth: true,
            requireWriteAccess: true,
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
            path: '/:conversationid/text',
            method: 'put',
            requireAuth: true,
            controller: replaceTurnText
        }, 
        {
            path: '/:conversationid/highlight', 
            method: 'post',
            requireAuth: false, 
            controller: createhighlight //creates highlight object, add to words
        },
        {
            path: '/:conversationid/highlight/:hid', 
            method: 'delete',
            requireAuth: false, 
            controller: deletehighlight //deletes entire highlight object/references
        },
        {
            path: '/:conversationid/highlight/:hid', 
            method: 'patch',
            requireAuth: false, 
            controller: updatehighlighttype //changes color or label associated with an hid
        },
        {
            path: '/:conversationid/highlight/:hid', 
            method: 'put',
            requireAuth: false, 
            controller: updatehighlightwords //adds or removes hid from word objects
        }
    ]
}