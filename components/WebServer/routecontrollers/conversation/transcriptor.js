const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:transcriptor`)
const FormData = require('form-data');
const axios = require(`${process.cwd()}/lib/utility/axios`)
const utf8 = require('utf8');
const fs = require('fs')


const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const { createJobInterval } = require(`${process.cwd()}/components/WebServer/controllers/jobsHandler`)

const { addFileMetadataToConversation, initConversation } = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const { storeFile } = require(`${process.cwd()}/components/WebServer/controllers/storeFile`)

const CONVERSATION_RIGHT = require(`${process.cwd()}/lib/dao/conversation/rights`)
const {
    ConversationNoFileUploaded,
    ConversationMetadataRequire,
    ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)
const {
    OrganizationNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

async function transcriptor(req, res, next) {
    try {
        const userId = req.payload.data.userId

        if (!req.files || Object.keys(req.files).length === 0) throw new ConversationNoFileUploaded()
        if (!req.body.name) throw new ConversationMetadataRequire("name param is required")
        if (!req.body.lang) throw new ConversationMetadataRequire("lang param is required")
        if (!req.body.right) req.body.right = CONVERSATION_RIGHT.READ + CONVERSATION_RIGHT.COMMENT
        if (!req.body.endpoint) throw new ConversationMetadataRequire("serviceEndpoint param is required")

        const transcriptionService = process.env.GATEWAY_SERVICES + '/' + req.body.endpoint

        if (req.body.organizationId) {
            const organization = await organizationModel.getOrganizationById(req.body.organizationId)
            if (organization.length !== 1) throw new OrganizationNotFound()
        } else {
            const organizations = await organizationModel.getPersonalOrganization(req.payload.data.userId)
            if (!organizations[0]?._id) throw new OrganizationNotFound()
            req.body.organizationId = organizations[0]._id
        }

        const conversation = await transcribeRequest(transcriptionService, req.body, req.files, userId)
        if (!conversation._id || !conversation?.jobs?.transcription?.job_id) throw new ConversationError()

        createJobInterval(transcriptionService, conversation.jobs.transcription.job_id, 'transcription', conversation)
        res.status(201).send({
            message: 'A conversation is currently being processed'
        })
    } catch (error) {
        next(error)
    }
}

async function transcribeRequest(transcriptionService, body, files, userId) {
    let originalFilePath
    try {
        const fileData = {
            ...files.file,
            name: utf8.decode(files.file.name)
        }
        let filePath = await storeFile(fileData, 'audio')
        originalFilePath = filePath.originalFilePath
        delete filePath.originalFilePath

        const options = prepareRequest(originalFilePath, body.transcriptionConfig)
        const job = await axios.postFormData(`${transcriptionService}/transcribe`, options)

        if (job && job.jobid) {
            let conversation = initConversation(body, userId, job.jobid)
            conversation = await addFileMetadataToConversation(conversation, filePath)

            const result = await conversationModel.createConversation(conversation)

            if (result.insertedCount !== 1) throw new ConversationError()
            fs.unlinkSync(originalFilePath)
            return conversation
        }
        return { status: 'error' }
    } catch (error) {
        fs.unlinkSync(originalFilePath)
        throw new ConversationError('Unable to transcribe the audio file', error)
    }
}

function prepareRequest(originalFilePath, transcriptionConfig) {
    const form = new FormData()
    form.append('file', fs.createReadStream(originalFilePath))

    if (transcriptionConfig) form.append('transcriptionConfig', transcriptionConfig.toString())
    else form.append('transcriptionConfig', '{}')

    let options = {
        headers: {
            'Content-Type': 'multipart/form-data',
            accept: 'application/json'
        },
        formData: form,
        encoding: null
    }

    return options
}

module.exports = {
    transcriptor
}