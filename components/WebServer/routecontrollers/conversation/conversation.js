const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)
const userUtility = require(`${process.cwd()}/components/WebServer/controllers/user/utility`)

const { deleteFile, getStorageFolder, getAudioWaveformFolder} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
    ConversationIdRequire,
    ConversationNotFound,
    ConversationMetadataRequire,
    ConversationUnsupportedMediaType,
    ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)


async function deleteConversation(req, res, next) {
    try {

        if (!req.params.conversationId) throw new ConversationIdRequire()
        const conversation = await model.conversation.getById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const result = await model.conversation.delete(req.params.conversationId)
        if (result.deletedCount !== 1) throw new ConversationError('Error when deleting conversation')

        const audioFilename = conversation[0].metadata.audio.filepath.split('/').pop()
        const jsonFilename = audioFilename.split('.')[0] + '.json'

        // delete audio file
        deleteFile(`${getStorageFolder()}/${conversation[0].metadata.audio.filepath}`)
        // delete audiowaveform json file
        deleteFile(`${getStorageFolder()}/${getAudioWaveformFolder()}/${jsonFilename}`)

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
        const conversation = await model.conversation.getById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const conv = {
            _id: req.params.conversationId,
            ...req.body
        }

        const result = await model.conversation.update(conv)
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

        let conversation
        if (req?.query?.key) {
            let filter = ['name', 'owner', 'organization', 'sharedWithUsers']

            if (typeof req.query.key === 'string') filter.push(req.query.key)
            else filter.push(...req.query.key)

            conversation = await model.conversation.getById(req.params.conversationId, filter)
        } else conversation = await model.conversation.getById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()
        conversation = conversation[0]

        const data = await conversationUtility.getUserRightFromConversation(req.payload.data.userId, conversation)

        if (((await model.organization.getByIdAndUser(conversation.organization.organizationId, req.payload.data.userId)).length) === 0) {
            delete conversation.organization
            delete conversation.sharedWithUsers
        }

        res.status(200).send({
            ...conversation,
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

        const conversation = await model.conversation.getById(req.params.conversationId)
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

async function getUsersByConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()

        const conversation = await model.conversation.getById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        let organization = await model.organization.getById(conversation[0].organization.organizationId)
        if (organization.length !== 1) throw new OrganizationNotFound()

        const userId = req.payload.data.userId
        const conversationUsers = await userUtility.getUsersListByConversation(userId, conversation[0], organization[0])
        res.status(200).send({
            conversationUsers
        })
    } catch (err) {
        next(err)
    }
}


async function searchConversation(req, res, next) {
    try {
        if (!req.body.searchType) throw new ConversationUnsupportedMediaType('searchType is required')

        const searchType = req.body.searchType
        const searchText = req.body.text.toLowerCase()
        const organizationId = req.body.organizationId || ''
        const userId = req.payload.data.userId

        const convUserList = await conversationUtility.getUserConversation(userId)

        let filteredConv = [] // conversations filtered by organization

        if (organizationId === '') {
            filteredConv = convUserList
        } else {
            const organizationConvos = convUserList.filter(conv => conv.organization.organizationId === organizationId)
            filteredConv = organizationConvos
        }

        let convSearch = []
        let convInArray = []
        for (const conv of filteredConv) {
            let addConv = false
            const textInConv = await conversationUtility.textInConversation(req.body.text, conv._id)
            // check if text is in conversation title
            if (!convInArray[conv._id]) {
                if (searchType.includes('title') && conv.name.toLowerCase().includes(searchText)) {
                    addConv = true
                }
                // check if text is in conversation description
                if (conv.description && searchType.includes('description') && conv.description.toLowerCase().includes(searchText)) {
                    addConv = true
                }
                // check if text is in conversation text
                if (searchType.includes('text') && textInConv) {
                    addConv = true
                }

                if (addConv) {
                    convInArray[conv._id] = true
                    convSearch.push(conv)
                }
            }

        }

        convSearch = await conversationUtility.getUserRightFromConversationList(userId, convSearch)

        if (convSearch.length === 0) res.status(204).send()
        else res.status(200).send({
            searchType,
            conversations: convSearch
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    deleteConversation,
    downloadConversation,
    getConversation,
    getUsersByConversation,
    searchConversation,
    updateConversation,
}