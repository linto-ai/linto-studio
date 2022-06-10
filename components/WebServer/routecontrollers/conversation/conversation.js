const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)
const userUtility = require(`${process.cwd()}/components/WebServer/controllers/user/utility`)

const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

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

        const data = await conversationUtility.getUserRightFromConversation(req.payload.data.userId, conversation[0])
        res.status(200).send({
            ...conversation[0],
            userAccess: data.access,
            personal: data.personal
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

async function getUsersByConversation(req, res, next) {
    try {
        let conversationUser = {
            organization_member: [],
            external_member: []
        }
        const userId = req.payload.data.userId
        if (!req.params.conversationId) throw new ConversationIdRequire()

        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        let organization = await organizationModel.getOrganizationById(conversation[0].organization.organizationId)
        if (organization.length !== 1) throw new OrganizationNotFound()

        const isInOrga = organization[0].users.filter(user => user.userId === userId)
        if (isInOrga.length === 0) {
            organization.users = organization.users.filter(oUser => oUser.visibility === TYPES.public)
        }

        const organization_custom_member = await userUtility.getUsersConversationByArary(conversation[0].organization.customRights)
        conversationUser.organization_member = await userUtility.getUsersConversationByArary(organization[0].users, conversation[0].organization.membersRight)
        conversationUser.external_member = await userUtility.getUsersConversationByArary(conversation[0].sharedWithUsers)

        conversationUser.organization_member.map(oUser => {
            for (let cUser of organization_custom_member) {
                if (cUser._id.toString() === oUser._id.toString()) {
                    oUser.right = cUser.right
                    break
                }
            }
        })

        res.status(200).send({
            ...conversationUser
        })
    } catch (err) {
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
    deleteConversation,
    getUsersByConversation
}