const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:file`)

const request = require(`${process.cwd()}/components/utility/request`)
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const path = require('path')

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/sttWrapper`)
const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)

async function audioUpload(req, res, next) {

  if (!req.files || Object.keys(req.files).length === 0)
    return res.status(400).send('No files were uploaded.')

  if (!req.files || Object.keys(req.body).length === 0)
    return res.status(400).send('No metadata was provided.')

  try {
    /* Block STT request*/
    const options = prepareRequest(req.files.file)
    const requestUri = 'https://alpha.linto.ai/stt/frenchbest/transcribe' //TODO: Need a way to config transcribe route
    let transcribe = await request.post(requestUri, options)
    /* End block STT request*/

    /* Block STT wrapper*/
    let conversation = SttWrapper.sttToConversation(transcribe, req.body)
    conversation = await SttWrapper.addFileMetadataToConversation(conversation, req.files.file)
    /* End block STT wrapper*/

    /* Store file on disk*/
    conversation.audio.filePath = storeFile(req.files.file)
    /*End store file on disk*/

    //WIP : Call controller transcribe to conversationData
    res.json(conversation)
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
      accept: 'application/json',
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
  return options
}

function storeFile(file) {
  let filePath = process.env.VOLUME_AUDIO_LOCATION + uuidv4() + '' + path.extname(file.name)
  fs.writeFileSync(filePath, file.data)
  return filePath
}