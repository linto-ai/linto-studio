const debug = require('debug')('app:router:api:conversation:convo')
const {
    createConvoBase,
    getSpeakers,
    createNewSpeaker,
    identifySpeaker,
    deleteSpeaker,
    updateSpeakerAudio,
    combineSpeakerIds,
    identifyTurnSpeaker,
    createNewTurnSpeaker,
    createTurn,
    deleteTurns,
    mergeTurns,
    splitTurns,
    renumberTurns
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/convo.js`)
const {
    updateWordText,
    deleteWordText,
    renumberWords,
    insertWords
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/textedit.js`)


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
            path: '/:conversationid/speakers/:speakerid',
            method: 'put',
            requireAuth: false,
            controller: updateSpeakerAudio
        },
        {
            path: '/:conversationid/turns/:speakerid',
            method: 'put',
            requireAuth: false,
            controller: combineSpeakerIds
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
            controller: createNewTurnSpeaker
        },
        {
            path: '/:conversationid/turn',
            method: 'post',
            requireAuth: false,
            controller: [createTurn, renumberTurns]
        },
        {
            path: '/:conversationid/turn/:turnids',
            method: 'delete',
            requireAuth: false,
            controller: [deleteTurns, renumberTurns]
        },
        {
            path: '/:conversationid/turn/:turnids',
            method: 'patch',
            requireAuth: false,
            controller: [mergeTurns, renumberTurns]
        },
        {
            path: '/:conversationid/turnsplit/:turnids',
            method: 'put',
            requireAuth: false,
            controller: [splitTurns, renumberTurns]
        },
        {
            path: '/:conversationid/word',
            method: 'put',
            requireAuth: false,
            controller: updateWordText
        },
        {
            path: '/:conversationid/word',
            method: 'delete',
            requireAuth: false,
            controller: [deleteWordText, renumberWords]
        },
        {
            path: '/:conversationid/word',
            method: 'post',
            requireAuth: false,
            controller: [insertWords, renumberWords]
        }
    ]
}