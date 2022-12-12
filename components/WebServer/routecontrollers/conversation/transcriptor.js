const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:transcriptor`)
const FormData = require('form-data');
const axios = require(`${process.cwd()}/lib/utility/axios`)
const utf8 = require('utf8');

const { v4: uuidv4 } = require('uuid');

const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const { createJobInterval } = require(`${process.cwd()}/components/WebServer/controllers/jobsHandler`)

const { addFileMetadataToConversation, initConversation } = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const { storeFile } = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const CONVERSATION_RIGHT = require(`${process.cwd()}/lib/dao/conversation/rights`)
const {
    ConversationNoFileUploaded,
    ConversationMetadataRequire,
    ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)
const {
    OrganizationNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

async function transcribeReq(req, res, next) {
    try {
        if (!req.files || Object.keys(req.files).length === 0) throw new ConversationNoFileUploaded()

        if (Array.isArray(req.files.file))  // Multifile
            await transcribe(false, req, res, next)
        else // Single file
            await transcribe(true, req, res, next)
    } catch (err) {
        next(err)
    }
}

async function transcribe(isSingleFile, req, res, next) {
    const userId = req.payload.data.userId

    if (!req.body.name) throw new ConversationMetadataRequire("name param is required")
    if (!req.body.lang) throw new ConversationMetadataRequire("lang param is required")
    if (!req.body.membersRight) req.body.membersRight = CONVERSATION_RIGHT.READ + CONVERSATION_RIGHT.COMMENT
    if (!req.body.endpoint) throw new ConversationMetadataRequire("serviceEndpoint param is required")

    req.body.organizationId = await checkOrganization(req.body.organizationId, userId)
    req.body.userId = userId

    let service = process.env.GATEWAY_SERVICES + '/' + req.body.endpoint
    let transcription_service = service

    const form_data = await prepareFileFormData(req.files)
    const options = await prepareRequest(form_data.form, req.body, isSingleFile)

    isSingleFile ? transcription_service += '/transcribe' : transcription_service += '/transcribe-multi'
    req.body.file_data = form_data.file_data

    const job = await axios.postFormData(transcription_service, options)
    await createConversationAndJobInterval(service, job, req.body)

    res.status(201).send({
        message: 'A conversation is currently being processed'
    })

}

async function prepareFileFormData(files) {
    const form = new FormData()
    let file_data = {}

    if (Array.isArray(files.file)) {
        for (const file of files.file) {
            form.append('file', file.data, { filename: uuidv4() })
        }
        file_data = await storeFile(files, 'multi_audio')
    } else {
        const fileData = {
            ...files.file,
            name: utf8.decode(files.file.name)
        }
        file_data = await storeFile(fileData, 'audio')
        form.append('file', files.file.data, { filename: uuidv4() })
    }
    return {
        form: form,
        file_data
    }
}

async function prepareRequest(form, body, isSingleFile) {
    if (isSingleFile && body.transcriptionConfig) form.append('transcriptionConfig', body.transcriptionConfig.toString())
    else if (isSingleFile) form.append('transcriptionConfig', '{}')
    else if (!isSingleFile && body.transcriptionConfig) form.append('multiTranscriptionConfig', body.transcriptionConfig.toString())
    else if (!isSingleFile) form.append('multiTranscriptionConfig', '{}')

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

async function createConversationAndJobInterval(service, job, body) {
    if (job && job.jobid) {
        let conversation = initConversation(body, body.userId, job.jobid)
        conversation = await addFileMetadataToConversation(conversation, body.file_data)

        const result = await conversationModel.createConversation(conversation)
        if (result.insertedCount !== 1) throw new ConversationError()

        if (!conversation._id || !conversation?.jobs?.transcription?.job_id) throw new ConversationError()
        createJobInterval(service, conversation.jobs.transcription.job_id, 'transcription', conversation)

        return conversation
    }
}

async function checkOrganization(organizationId, userId) {
    if (organizationId) {
        const organization = await organizationModel.getOrganizationById(organizationId)
        if (organization.length === 1) return organizationId
    } else {
        const organizations = await organizationModel.getPersonalOrganization(userId)
        if (organizations[0]?._id) return organizations[0]._id.toString()
    }
    throw new OrganizationNotFound()
}


module.exports = {
    transcribeReq
}


