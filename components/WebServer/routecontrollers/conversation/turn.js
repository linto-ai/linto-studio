const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:turn`)

const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)

const { cp } = require('fs')
const { v4: uuidv4 } = require('uuid')

const {
    ConversationIdRequire,
    ConversationNotFound,
    ConversationError,
    TurnIdRequire,
    TurnNotFound
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function addTurn(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        if (!req.params.turnId) throw new TurnIdRequire()   // Will add a turn after that turnId

        let conversationId = req.params.conversationId
        const conversation = await conversationModel.getConvoById(conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        let addedTurn = []
        let isTurnAdded = false
        conversation[0].text.map((turn, i) => {
            addedTurn.push(turn)
            if (turn.turn_id === req.params.turnId) {
                addedTurn.push({ ...req.body, turn_id: uuidv4() })
                isTurnAdded = true
            }
        })

        if (!isTurnAdded) throw new TurnNotFound()

        const result = await conversationModel.updateTurn(req.params.conversationId, addedTurn)
        if (result.matchedCount === 0) throw new ConversationError()

        res.status(200).send({
            message: 'Conversation turn has been added'
        })
    } catch (err) {
        next(err)
    }
}

async function deleteTurn(req, res, next) {
    try {

        if (!req.params.conversationId) throw new ConversationIdRequire()
        if (!req.params.turnId) throw new TurnIdRequire()

        let conversationId = req.params.conversationId
        const conversation = await conversationModel.getConvoById(conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const turnToRemove = conversation[0].text.filter(turn => turn.turn_id !== req.params.turnId)
        if (conversation[0].text.length === turnToRemove.length) throw new TurnNotFound()

        const result = await conversationModel.updateTurn(req.params.conversationId, turnToRemove)
        if (result.matchedCount === 0) throw new ConversationError()

        res.status(200).send({
            message: 'Conversation turn has been deleted'
        })
    } catch (err) {
        next(err)
    }
}

async function updateTurn(req, res, next) {
    try {

        if (!req.params.conversationId) throw new ConversationIdRequire()
        if (!req.params.turnId) throw new TurnIdRequire()

        let conversationId = req.params.conversationId
        let conversation = await conversationModel.getConvoById(conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        let updatedTurn = []
        let isTurnUpdated = false

        for (let turn of conversation[0].text) {
            if (turn.turn_id === req.params.turnId) {
                turn = req.body
                turn.turn_id = req.params.turnId
                isTurnUpdated = true
            }
            updatedTurn.push(turn)
        }

        if (!isTurnUpdated) throw new TurnNotFound()

        const result = await conversationModel.updateTurn(req.params.conversationId, updatedTurn)
        if (result.matchedCount === 0) throw new ConversationError()

        res.status(200).send({
            message: 'Conversation turn has been updated'
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    addTurn,
    deleteTurn,
    updateTurn
}