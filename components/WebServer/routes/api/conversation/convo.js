const debug = require('debug')('app:router:api/conversation')

// Speakers
const {
    combineSpeakerIds,
    createNewSpeaker,
    deleteSpeaker,
    identifySpeaker,
    getSpeakers
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/speakers.js`)

// Share With 
const {
    addShareWith,
    removeShareWith,
    updateShareWith
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/sharewith.js`)

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

/*
const {
    createConvoBase,
    deleteConvo
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/convo.js`)
*/

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
            // Create a conversation (upload 1 file)
            path: '/create',
            method: 'post',
            requireAuth: true,
            controller: audioUpload
        },
        /*{
            path: '/',
            method: 'post',
            requireAuth: true,
            controller: createConvoBase
        }, {
            path: '/',
            method: 'delete',
            requireAuth: true,
            requireOwnerAccess: true,
            controller: deleteConvo
        },*/
        {
            // Get speakers for a conversation
            path: '/:conversationid/speakers',
            method: 'get',
            requireAuth: true,
            requireReadAccess: true,
            controller: getSpeakers
        },
        {
            // Create a speaker for a conversation
            path: '/:conversationid/speakers',
            method: 'post',
            requireAuth: true,
            requireWriteAccess: true,
            controller: createNewSpeaker
        },
        {
            // Rename a speaker in a conversation
            path: '/:conversationid/speakers/:speakerid',
            method: 'patch',
            requireAuth: true,
            requireWriteAccess: true,
            controller: identifySpeaker
        },
        {
            // Remove a speaker from a conversation
            path: '/:conversationid/speakers/:speakerid',
            method: 'delete',
            requireAuth: true,
            requireWriteAccess: true,
            controller: deleteSpeaker
        },
        {
            // Merge two speakers in a converation
            path: '/:conversationid/mergespeakers/:speakerid',
            method: 'patch',
            requireAuth: true,
            requireWriteAccess: true,
            controller: [combineSpeakerIds, deleteSpeaker]
        },
        {
            // Update a speaker for a turn in a conversation
            path: '/:conversationid/turnspeaker/:turnid',
            method: 'put',
            requireAuth: true,
            requireWriteAccess: true,
            controller: identifyTurnSpeaker
        },
        {
            // Create a new turn for a speaker in a conversation
            path: '/:conversationid/turn/:speakerid',
            method: 'post',
            requireAuth: true,
            requireWriteAccess: true,
            controller: [createTurn, renumberTurns]
        },
        {
            // Remove a turn in a converation
            path: '/:conversationid/turn',
            method: 'delete',
            requireAuth: true,
            requireWriteAccess: true,
            controller: [deleteTurns, renumberTurns]
        },
        {
            // Merge two or more consecutive turns in a conversation
            path: '/:conversationid/turn/merge',
            method: 'patch',
            requireAuth: true,
            requireWriteAccess: true,
            controller: [mergeTurns, renumberTurns]
        },
        {
            // Split a turn in a conversation
            path: '/:conversationid/turn/split',
            method: 'put',
            requireAuth: true,
            requireWriteAccess: true,
            controller: [splitTurns, renumberTurns]
        },
        {
            // Update text object in a conversation
            path: '/:conversationid/text',
            method: 'put',
            requireAuth: true,
            requireWriteAccess: true,
            controller: replaceTurnText
        },
        {
            // Creates highlight object + add to words in a conversation
            path: '/:conversationid/highlight',
            method: 'post',
            requireAuth: true,
            requireWriteAccess: true,
            controller: createhighlight
        },
        {
            // Deletes entire highlight object/references in a conversation
            path: '/:conversationid/highlight/:hid',
            method: 'delete',
            requireAuth: true,
            requireWriteAccess: true,
            controller: deletehighlight
        },
        {
            // Update an highlight in a conversation (color and/or label)
            path: '/:conversationid/highlight/:hid',
            method: 'patch',
            requireAuth: true,
            requireWriteAccess: true,
            controller: updatehighlighttype
        },
        {
            // Adds or removes highlight on word(s) in a conversations
            path: '/:conversationid/highlight/:hid',
            method: 'put',
            requireAuth: true,
            requireWriteAccess: true,
            controller: updatehighlightwords
        },
        {
            // Add a "shared with" user to a conversation
            path: '/:conversationid/sharewith',
            method: 'put',
            requireAuth: true,
            requireWriteAccess: true,
            controller: addShareWith
        },
        {
            // Update a "shared with" user to a conversation
            path: '/:conversationid/sharewith/:userid',
            method: 'patch',
            requireAuth: false,
            requireWriteAccess: false,
            controller: updateShareWith
        },
        {
            // Remove a "shared with" user from a conversation
            path: '/:conversationid/sharewith/:userid',
            method: 'delete',
            requireAuth: true,
            requireWriteAccess: true,
            controller: removeShareWith
        },


    ]
}