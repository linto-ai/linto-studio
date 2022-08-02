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
const { getTranscriptionService } = require(`${process.cwd()}/components/WebServer/controllers/services/utility`)

const CONVERSATION_RIGHT = require(`${process.cwd()}/lib/dao/rights/conversation`)
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
        if (!req.body.right) req.body.right = CONVERSATION_RIGHT.READ + CONVERSATION_RIGHT.COMMENT
        if (!req.body.serviceName) throw new ConversationMetadataRequire("serviceName param is required")

        req.body.service = getTranscriptionService(req.body.serviceName)

        if (req.body.organizationId) {
            const organization = await organizationModel.getOrganizationById(req.body.organizationId)
            if (organization.length !== 1) throw new OrganizationNotFound()
        } else {
            const organizations = await organizationModel.getPersonalOrganization()
            organizations.map(organization => {
                if (organization.owner === req.payload.data.userId) {
                    req.body.organizationId = organization._id
                    return true
                }
            })
        }

        const conversation = await transcribe(req.body, req.files, userId)
        if (!conversation._id || !conversation?.jobs?.transcription?.job_id) throw new ConversationError()

        createJobInterval(req.body.service.host, conversation.jobs.transcription.job_id, 'transcription', conversation)
        res.status(201).send({
            message: 'A conversation is currently being processed'
        })
    } catch (error) {
        next(error)
    }
}

async function transcribe(body, files, userId) {
    try {
        const fileData = {
            ...files.file,
            name: utf8.decode(files.file.name)
        }
        const filePath = await storeFile(fileData, 'audio')
        const options = prepareRequest(filePath, body.transcriptionConfig)
        const job = await axios.postFormData(`${body.service.host}/transcribe`, options)

        if (job && job.jobid) {
            let conversation = initConversation(body, userId, job.jobid)
            conversation = await addFileMetadataToConversation(conversation, filePath)

            const result = await conversationModel.createConversation(conversation)
            if (result.insertedCount !== 1) throw new ConversationError()
            return conversation
        }
        return { status: 'error' }
    } catch (error) {
        throw new ConversationError('Unable to transcribe the audio file', error)
    }
}

function prepareRequest(file, transcriptionConfig) {
    const form = new FormData()
    form.append('file', fs.createReadStream(file.storageFilePath))

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

    if (process.env.STT_REQUIRE_AUTH === 'true')
        options.headers.Authorization = 'Basic ' + Buffer.from(process.env.STT_USER + ':' + process.env.STT_PASSWORD).toString('base64');

    return options
}

module.exports = {
    transcriptor
}