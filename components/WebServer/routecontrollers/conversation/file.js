const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:file`)

const request = require(`${process.cwd()}/components/utility/request`)

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversationGenerator`)
const StoreFile = require(`${process.cwd()}/components/WebServer/controllers/file`)

const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)

const { ConversationNoFileUploaded, ConversationMetadataRequire } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)


async function audioUpload(req, res, next) {
    if (!req.files || Object.keys(req.files).length === 0)
        next(new ConversationNoFileUploaded())

    if (!req.body.payload || Object.keys(req.body).length === 0)
        next(new ConversationMetadataRequire())

    try {
        const file = req.files.file
        const payload = {...JSON.parse(req.body.payload), owner: req.payload.data.userId }

        // Block STT request
        const options = prepareRequest(file)
        const transcribe = await request.post(process.env.STT_HOST, options)
            // End block STT request

        // Block STT wrapper
        let conversation = SttWrapper.sttToConversation(transcribe, payload)
        await SttWrapper.addFileMetadataToConversation(conversation, file)
            // End block STT wrapper

        // Store file on disk
        conversation.audio.filepath = await StoreFile.storeFile(file, 'audio')
            // End store file on disk

        // Storing conversation to DB
        const createConvo = await convoModel.createConversation(conversation)
        if (createConvo.status === 'success') {
            res.status(200).send({
                txtStatus: 'success',
                msg: 'A new conversation has been created'
            })
        } else throw createConvo
            // End storing conversation to DB 
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
                    type: 'audio/wav',
                    contentType: 'audio/wav'
                }
            },
            speaker: 'no'
        },
        encoding: null
    }

    if (process.env.STT_REQUIRE_AUTH === 'true')
        options.headers.Authorization = 'Basic ' + Buffer.from(process.env.STT_USER + ':' + process.env.STT_PASSWORD).toString('base64');
    return options
}