const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:transcriptor`)

const request = require(`${process.cwd()}/lib/utility/request`)

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversationGenerator`)
const StoreFile = require(`${process.cwd()}/components/WebServer/controllers/storeFile`)
const TranscriptionHandler = require(`${process.cwd()}/components/WebServer/controllers/transcriptorHandler`)

const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)

const { 
    ConversationNoFileUploaded, 
    ConversationMetadataRequire, 
    ConversationError 
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function transcriptor(req, res, next) {
    try {
        if (!req.files || Object.keys(req.files).length === 0) throw new ConversationNoFileUploaded()
        if (!req.body.name) throw new ConversationMetadataRequire()

        const conversation = await transcribe(req)

        if(!conversation._id && !conversation.job.job_id) throw new ConversationError()
        
        TranscriptionHandler.createJobInterval(conversation)
        res.status(200).send({
            msg: 'A conversation is currently being processed'
        })
    } catch (error) {
        res.status(error.status).send({ message: error.message })
    }
}

async function transcribe(req){
    const file = req.files.file

    const payload = {...req.body, owner: req.payload.data.userId }

    // STT request
    const options = prepareRequest(file)
    const job_buffer = await request.post(`${process.env.STT_HOST}/transcribe`, options)

    if(job_buffer){
        const job = JSON.parse(job_buffer)
        if(job.jobid){
            let conversation = SttWrapper.initConversation(payload, job.jobid )
            const filepath = await StoreFile.storeFile(file, 'audio')
            conversation = await SttWrapper.addFileMetadataToConversation(conversation, file, filepath)

            const mongo_status = await conversationModel.createConversation(conversation)
            if(mongo_status.status === 'success')
                return conversation
        }
    }
    return { status : 'error' }
}

function prepareRequest(file) {
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

    let transcriptionConfig = {
        enablePunctuation: false,
        diarizationConfig: {
          enableDiarization: false,
          numberOfSpeaker: 0,
          maxNumberOfSpeaker: 0
        }
      }

    if(process.env.STT_ENABLE_PUNCTUATION === "true")
        transcriptionConfig.enablePunctuation = true
    if(process.env.STT_ENABLE_DIARIZATION === "true")
        transcriptionConfig.diarizationConfig.enableDiarization = true
    if(process.env.STT_NUMBER_OF_SPEAKER !== "0")
        transcriptionConfig.diarizationConfig.numberOfSpeaker = parseInt(process.env.NUMBER_OF_SPEAKER)
    if(process.env.STT_MAX_NUMBER_OF_SPEAKER !== "0")
        transcriptionConfig.diarizationConfig.maxNumberOfSpeaker = parseInt(process.env.MAX_NUMBER_OF_SPEAKER)

    options.formData.transcriptionConfig = JSON.stringify(transcriptionConfig)

    if (process.env.STT_REQUIRE_AUTH === 'true')
        options.headers.Authorization = 'Basic ' + Buffer.from(process.env.STT_USER + ':' + process.env.STT_PASSWORD).toString('base64');
    return options
}

module.exports = {
    transcriptor
}