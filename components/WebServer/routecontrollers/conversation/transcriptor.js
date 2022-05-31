const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:transcriptor`)

const request = require(`${process.cwd()}/lib/utility/request`)

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)

const StoreFile = require(`${process.cwd()}/components/WebServer/controllers/storeFile`)
const TranscriptionHandler = require(`${process.cwd()}/components/WebServer/controllers/transcriptorHandler`)

const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

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
        if (!req.files || Object.keys(req.files).length === 0) throw new ConversationNoFileUploaded()
        if (!req.body.name) throw new ConversationMetadataRequire()

        const userId = req.payload.data.userId
        if (!req.body.right) req.body.right = CONVERSATION_RIGHT.READ + CONVERSATION_RIGHT.COMMENT

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
        if (!conversation._id && !conversation.job.job_id) throw new ConversationError()

        TranscriptionHandler.createJobInterval(conversation)
        res.status(201).send({
            message: 'A conversation is currently being processed'
        })
    } catch (error) {
        console.error(error)
        res.status(error.status).send({ message: error.message })
    }
}

async function transcribe(body, files, userId) {
    try {
        const file = files.file
        const options = prepareRequest(file, body.transcriptionConfig)
        const job_buffer = await request.post(`${process.env.STT_HOST}/transcribe`, options)

        if (job_buffer) {
            const job = JSON.parse(job_buffer)
            if (job.jobid) {
                let conversation = SttWrapper.initConversation(body, userId, job.jobid)
                const filepath = await StoreFile.storeFile(file, 'audio')
                conversation = await SttWrapper.addFileMetadataToConversation(conversation, file, filepath)
                conversation.transcriptionConfig = JSON.parse(options.formData.transcriptionConfig)

                const result = await conversationModel.createConversation(conversation)
                if (result.insertedCount !== 1) throw new ConversationError()
                return conversation
            }
        }
        return { status: 'error' }
    } catch (error) {
        throw new ConversationError('Unable to transcribe the audio file')
    }
}

function prepareRequest(file, transcriptionConfig) {
    let options = {
        headers: {
            accept: 'application/json'
        },
        formData: {
            file: {
                value: file.data,
                options: {
                    filename: file.name,
                    type: file.mimetype.split('/').pop(),
                    contentType: file.mimetype,
                }
            }
        },
        encoding: null
    }


    if (transcriptionConfig) options.formData.transcriptionConfig = transcriptionConfig
    else options.formData.transcriptionConfig = {}

    if (process.env.STT_REQUIRE_AUTH === 'true')
        options.headers.Authorization = 'Basic ' + Buffer.from(process.env.STT_USER + ':' + process.env.STT_PASSWORD).toString('base64');

    return options
}

module.exports = {
    transcriptor
}