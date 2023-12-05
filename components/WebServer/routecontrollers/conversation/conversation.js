const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)
const userUtility = require(`${process.cwd()}/components/WebServer/controllers/user/utility`)

const { deleteFile, getStorageFolder, getAudioWaveformFolder } = require(`${process.cwd()}/components/WebServer/controllers/files/store`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const { fetchJob } = require(`${process.cwd()}/components/WebServer/controllers/job/fetchHandler`)

const {
    ConversationIdRequire,
    ConversationNotFound,
    ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)


async function deleteConversation(req, res, next) {
    try {

        if (!req.params.conversationId) throw new ConversationIdRequire()
        const conversation = await model.conversations.getById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const result = await model.conversations.delete(req.params.conversationId)
        if (result.deletedCount !== 1) throw new ConversationError('Error when deleting conversation')

        const audioFilename = conversation[0].metadata.audio.filepath.split('/').pop()
        const jsonFilename = audioFilename.split('.')[0] + '.json'

        // delete audio file
        deleteFile(`${getStorageFolder()}/${conversation[0].metadata.audio.filepath}`)
        // delete audiowaveform json file
        deleteFile(`${getStorageFolder()}/${getAudioWaveformFolder()}/${jsonFilename}`)

        // delete also all subtitle related to that conversation
        await model.conversationSubtitles.deleteAllFromConv(req.params.conversationId)


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
        const conversation = await model.conversations.getById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const conv = {
            _id: req.params.conversationId,
            ...req.body
        }

        const result = await model.conversations.update(conv)
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

        let conversation = await model.conversations.getById(req.params.conversationId, ['jobs'])
        if (conversation.length !== 1) throw new ConversationNotFound()

        await fetchJob(req.params.conversationId, conversation[0].jobs)

        if (req?.query?.key && typeof req.query.key === 'string') {
            const projectionValue = req.query.projection && /^\d+$/.test(req.query.projection) ? parseInt(req.query.projection, 10) : 1;
            let filter = ['name', 'owner', 'organization', 'sharedWithUsers', 'jobs']

            let projection = {}
            req.query.key.split(',').map(key => {
                if (!projection.hasOwnProperty(key)) {
                    projection[key] = projectionValue
                }
            })

            filter.forEach(field => {
                if (projectionValue === 1) projection[field] = 1
                else delete projection[field]
            })

            conversation = await model.conversations.getByIdWithFilter(req.params.conversationId, projection)
        } else conversation = await model.conversations.getById(req.params.conversationId)
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

async function getUsersByConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()

        const conversation = await model.conversations.getById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        let organization = await model.organizations.getById(conversation[0].organization.organizationId)
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

async function getUsersByConversationList(req, res, next) {
    try {
        let result = []
        const conversationsIds = req.body.conversations.split(',')
        for (const conversationId of conversationsIds) {
            const conversation = await model.conversations.getById(conversationId)

            let organization = await model.organizations.getById(conversation[0].organization.organizationId)
            if (organization.length !== 1) throw new OrganizationNotFound()

            const userId = req.payload.data.userId
            const conversationUsers = await userUtility.getUsersListByConversation(userId, conversation[0], organization[0])
            result.push({ conversationId, member: { ...conversationUsers } })
        }
        res.status(200).send(result)

    } catch (err) {
        next(err)
    }
}

module.exports = {
    deleteConversation,
    getConversation,
    getUsersByConversation,
    getUsersByConversationList,
    updateConversation,
}
