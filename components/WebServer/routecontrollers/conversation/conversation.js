const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)
const userUtility = require(`${process.cwd()}/components/WebServer/controllers/user/utility`)

const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const {
    ConversationIdRequire,
    ConversationNotFound,
    ConversationMetadataRequire,
    ConversationError,
    ConversationLocked
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function getOwnerConversation(req, res, next) {
    try {
        const conversationList = await conversationModel.getAllConvos()
        const conversations = conversationList.filter(conversation => conversation.owner === req.payload.data.userId)

        res.json({
            conversations
        })
    } catch (err) {
        next(err)
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
        next(err)
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
        next(err)
    }
}

async function getConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()

        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const data = await conversationUtility.getUserRightFromConversation(req.payload.data.userId, conversation[0])
        res.status(200).send({
            ...conversation[0],
            userAccess: data.access,
            personal: data.personal
        })
    } catch (err) {
        next(err)
    }
}


async function downloadConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        if (!req.params.format) throw new ConversationMetadataRequire('format is required')

        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        let output = ""
        if (req.params.format === 'json') {
            output = conversation[0].text
        }

        else if (req.params.format === 'text') {
            if (!conversation[0].text) throw new ConversationError('Conversation has no text')
            conversation[0].text.map(text => {
                output += text.segment + ""
            })
        }

        else throw new ConversationMetadataRequire('Format not supported')

        res.status(200).send(output)
    } catch (err) {
        next(err)
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
        next(err)
    }
}

async function searchText(req, res, next) {
    try {
        const userId = req.payload.data.userId
        const convList = await conversationUtility.getUserConversation(userId)
        let convText = []
        for (let conversation of convList) {
            const conv = (await conversationModel.getConvoById(conversation._id))[0]

            for (const text of conv.text) {
                if (text.raw_segment.toLowerCase().includes(req.body.text.toLowerCase())) {
                    convText.push(conv)
                    break
                }
            }
        }

        res.status(200).send({
            search_text: req.body.text,
            conversations: convText
        })
    } catch (err) {
        next(err)
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
        next(err)
    }
}

async function getUsersByConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()

        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        let organization = await organizationModel.getOrganizationById(conversation[0].organization.organizationId)
        if (organization.length !== 1) throw new OrganizationNotFound()

        const conversationUsers = await userUtility.getUsersListByConversation(conversation[0], organization[0])
        res.status(200).send({
            conversationUsers
        })
    } catch (err) {
        next(err)
    }
}

async function lockConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        if (!req.body.lock) throw new ConversationMetadataRequire()
        const lock = parseInt(req.body.lock)
        if (isNaN(lock)) throw new ConversationMetadataRequire('lock must be a number')

        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        if (lock === 1 && conversation?.[0]?.locked === 1) throw new ConversationLocked()
        else if (lock === 0 && conversation?.[0]?.locked === 0) res.status(200).send()
        else if ((lock === 1 && conversation?.[0]?.locked === 0) ||
            (lock === 0 && conversation?.[0]?.locked === 1)) {
            await conversationModel.updateLock(req.params.conversationId, lock)
            res.status(200).send()
        } else throw new ConversationError()

    } catch (err) {
        next(err)
    }
}

module.exports = {
    getOwnerConversation,
    getConversation,
    downloadConversation,
    listConversation,
    lockConversation,
    updateConversation,
    updateConversationRights,
    searchText,
    deleteConversation,
    getUsersByConversation
}