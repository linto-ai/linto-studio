const debug = require('debug')('app:router:api/conversation')

// Speakers
const {
    combineSpeakerIds,
    createNewSpeaker,
    deleteSpeaker,
    identifySpeaker,
    getSpeakers,
    updateSpeakerMap
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
    replaceTurnText,
    replaceFullText
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/textedit.js`)

const {
    updatehighlightwords,
    updatehighlighttype,
    createhighlight,
    deletehighlight
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/annotations.js`)

const { // Create conversation based on file
    transcriptor
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/transcriptor.js`)

const { // update conversation metadata
    updateTitle,
    updateDescription,
    updateAgenda,
    updateConvoType,
    deleteConversation
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/convo.js`)

module.exports = (webserver) => {
    return [{
            // Create a conversation (upload 1 file)
            path: '/create',
            method: 'post',
            requireAuth: true,
            controller: transcriptor
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
            requireConversationOwnerAccess: true,
            controller: deleteConvo
        },*/
        {
            // Get speakers for a conversation
            path: '/:conversationid/speakers',
            method: 'get',
            requireAuth: true,
            requireConversationReadAccess: true,
            controller: getSpeakers
        },
        {
            // Create a speaker for a conversation
            path: '/:conversationid/speakers',
            method: 'post',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: createNewSpeaker
        },
        {
            // Rename a speaker in a conversation
            path: '/:conversationid/speakers/:speakerid',
            method: 'patch',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: identifySpeaker
        },
        {
            // Remove a speaker from a conversation
            path: '/:conversationid/speakers/:speakerid',
            method: 'delete',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: deleteSpeaker
        },
        {
            // Merge two speakers in a converation
            path: '/:conversationid/mergespeakers/:speakerid',
            method: 'patch',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: [combineSpeakerIds, deleteSpeaker]
        },
        {
            // Update a speaker for a turn in a conversation
            path: '/:conversationid/turnspeaker/:turnid',
            method: 'put',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: identifyTurnSpeaker
        },
        {
            // Create a new turn for a speaker in a conversation
            path: '/:conversationid/turn/:speakerid',
            method: 'post',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: [createTurn, renumberTurns]
        },
        {
            // Remove a turn in a converation
            path: '/:conversationid/turn',
            method: 'delete',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: [deleteTurns, renumberTurns]
        },
        {
            // Merge two or more consecutive turns in a conversation
            path: '/:conversationid/turn/merge',
            method: 'patch',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: [mergeTurns, renumberTurns]
        },
        {
            // Split a turn in a conversation
            path: '/:conversationid/turn/split',
            method: 'put',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: [splitTurns, renumberTurns]
        },
        {
            // Update text object in a conversation
            path: '/:conversationid/fulltext',
            method: 'put',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: replaceFullText
        },
        {
            // Update text object in a conversation
            path: '/:conversationid/text',
            method: 'put',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: replaceTurnText
        },
        {
            // Creates highlight object + add to words in a conversation
            path: '/:conversationid/highlight',
            method: 'post',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: createhighlight
        },
        {
            // Deletes entire highlight object/references in a conversation
            path: '/:conversationid/highlight/:hid',
            method: 'delete',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: deletehighlight
        },
        {
            // Update an highlight in a conversation (color and/or label)
            path: '/:conversationid/highlight/:hid',
            method: 'patch',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updatehighlighttype
        },
        {
            // Adds or removes highlight on word(s) in a conversations
            path: '/:conversationid/highlight/:hid',
            method: 'put',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updatehighlightwords
        },
        {
            // Add a "shared with" user to a conversation
            path: '/:conversationid/sharewith',
            method: 'put',
            requireAuth: true,
            requireConversationOwnerAccess: true,
            controller: addShareWith
        },
        {
            // Update a "shared with" user to a conversation
            path: '/:conversationid/sharewith/:userid',
            method: 'patch',
            requireAuth: true,
            requireConversationOwnerAccess: true,
            controller: updateShareWith
        },
        {
            // Remove a "shared with" user from a conversation
            path: '/:conversationid/sharewith/:userid',
            method: 'delete',
            requireAuth: true,
            requireConversationOwnerAccess: true,
            controller: removeShareWith
        },
        {
            // updates conversation metatdata
            path: '/:conversationid/title',
            method: 'put',
            requireAuth: false,
            requireConversationWriteAccess: false,
            controller: updateTitle
        },
        {
            // updates conversation metatdata
            path: '/:conversationid/description',
            method: 'put',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updateDescription
        },
        {
            // updates conversation metatdata
            path: '/:conversationid/agenda',
            method: 'put',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updateAgenda
        },
        {
            // updates conversation metatdata
            path: '/:conversationid/convotype',
            method: 'put',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updateConvoType
        },
        {
            // updates conversation metatdata
            path: '/:conversationid/speakermap',
            method: 'put',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: updateSpeakerMap
        },
        {
            // Delete a conversation by convoid
            // updates conversation metatdata
            path: '/:conversationid',
            method: 'delete',
            requireAuth: true,
            requireConversationWriteAccess: true,
            controller: deleteConversation
        }
    ]
}