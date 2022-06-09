const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const {
    ConversationIdRequire,
    ConversationNotFound,
    ConversationMetadataRequire,
    ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function getOwnerConversation(req, res, next) {
    try {
        const conversationList = await conversationModel.getAllConvos()
        const conversations = conversationList.filter(conversation => conversation.owner === req.payload.data.userId)

        res.json({
            conversations
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })

    }
}

async function deleteConversation(req, res, next) {
    try {

        if (!req.params.conversationId) throw new ConversationIdRequire()
        let conversationId = req.params.conversationId
        const conversation = await conversationModel.getConvoById(conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()
        const result = await conversationModel.deleteById(conversationId)

        if (result.deletedCount !== 1) throw new ConversationError('Error when deleting conversation')

        res.status(200).send({
            message: 'Conversation has been deleted'
        })
    } catch (err) {
        console.error(err)
        res.status(err.status).send({ message: err.message })
    }
}


async function updateConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const conv = {
            _id: req.params.conversationId,
            ...req.body
        }

        const result = await conversationModel.update(conv)
        if (result.matchedCount === 0) throw new ConversationError()

        res.status(200).send({
            message: 'Conversation updated'
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function getConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()

        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const access = await conversationUtility.getUserRightFromConversation(req.payload.data.userId, conversation[0])
        res.status(200).send({
            ...conversation[0],
            userAccess : access
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function listConversation(req, res, next) {
    try {
        const userId = req.payload.data.userId
        const convList = await conversationUtility.getUserConversation(userId)

        res.status(200).send({
            conversations: convList
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}

async function searchText(req, res, next) {
    try {
        const userId = req.payload.data.userId
        const convList = await conversationUtility.getUserConversation(userId)
        let convText = []
        convList.map(conversation => {
            for (const text of conversation.text) {
                if (text.raw_segment.toLowerCase().includes(req.body.text.toLowerCase())) {
                    convText.push(conversation)
                    break
                }
            }
        })

        res.status(200).send({
            search_text: req.body.text,
            conversations: convText
        })
    } catch (err) {
        res.status(err.status).send({ message: err.message })
    }
}


async function updateConversationRights(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        if (req.body.right === undefined || !req.params.userId) throw new ConversationMetadataRequire("rights or userId are require")

        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const organization = await organizationModel.getOrganizationById(conversation[0].organization.organizationId)
        if (organization.length !== 1) throw new OrganizationNotFound()

        const isInOrga = organization[0].users.filter(user => user.userId === req.params.userId)

        // Select user right in the conversation
        let userRight = isInOrga.length === 0 ? conversation[0].sharedWithUsers : conversation[0].organization.customRights

        let isAdded = false
        if (req.body.right === 0 && isInOrga.length === 0) {
            userRight = userRight.filter(usr => usr.userId !== req.params.userId)
            isAdded = true
        } else {
            const userIndex = userRight.findIndex(usr => usr.userId === req.params.userId)
            if (userIndex >= 0) {
                isAdded = true
                userRight[userIndex].right = req.body.right
            }
        }
        if (!isAdded) userRight.push({ userId: req.params.userId, right: req.body.right })

        isInOrga.length === 0 ? conversation[0].sharedWithUsers = userRight : conversation[0].organization.customRights = userRight

        const conv = {
            _id: req.params.conversationId,
            ...conversation[0]
        }

        const result = await conversationModel.update(conv)
        if (result.matchedCount === 0) throw new ConversationError()

        res.status(200).send({
            message: 'Conversation updated'
        })
    } catch (err) {
        console.error(err)
        res.status(err.status).send({ message: err.message })
    }
}

module.exports = {
    getOwnerConversation,
    getConversation,
    listConversation,
    updateConversation,
    updateConversationRights,
    searchText,
    deleteConversation
}