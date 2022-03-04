const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:file`)
const path = require('path')

const request = require(`${process.cwd()}/lib/utility/request`)

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversationGenerator`)
const StoreFile = require(`${process.cwd()}/components/WebServer/controllers/file`)
const TranscriptionHandler = require(`${process.cwd()}/components/WebServer/controllers/transcriptionHandler`)

const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)

const { ConversationNoFileUploaded, ConversationMetadataRequire } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function audioUpload(req, res, next) {
    try {
        const conversation = await transcribe(req)
        // End block STT request
        if(conversation._id && conversation.job.job_id){
            TranscriptionHandler.createJobInterval(conversation)
            res.status(200).send({
                txtStatus: 'success',
                msg: 'A conversation is currently being processed'
            })
        } else{
            res.status(400).send({
                txtStatus: 'error',
                msg: 'error on uploading audio file'
            })
        }
        return
    } catch (error) {
        // Error
        console.error(error)
        res.status(400).send({
            txtStatus: 'error',
            msg: !!error.message ? error.message : 'error on uploading audio file'
        })
    }
}

module.exports = {
    audioUpload
}

async function transcribe(req){
    if (!req.files || Object.keys(req.files).length === 0)
        next(new ConversationNoFileUploaded())
    if (!req.body.payload || Object.keys(req.body).length === 0)
        next(new ConversationMetadataRequire())

    const file = req.files.file
    const payload = {...JSON.parse(req.body.payload), owner: req.payload.data.userId }

    // Block STT request
    const options = prepareRequest(file)
    const job_buffer = await request.post(`${process.env.STT_HOST}/transcribe`, options)

    if(job_buffer){
        const job = JSON.parse(job_buffer)
        if(job.jobid){
            let conversation = SttWrapper.initConversation(payload, job.jobid )
            const filepath = await StoreFile.storeFile(file, 'audio')
            conversation = await SttWrapper.addFileMetadataToConversation(conversation, file, filepath)

            const mongo_status = await convoModel.createConversation(conversation)
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

