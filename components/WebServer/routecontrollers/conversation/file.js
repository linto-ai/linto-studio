const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:file`)

const request = require(`${process.cwd()}/components/utility/request`)
const path = require('path')

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversationGenerator`)
const StoreFile = require(`${process.cwd()}/components/WebServer/controllers/file`)

const convoModel = require(`${process.cwd()}/models/mongodb/models/conversations`)

async function audioUpload(req, res, next) {
  if (!req.files || Object.keys(req.files).length === 0)
    return res.status(400).send('No files were uploaded.')

  if (!req.body || Object.keys(req.body).length === 0)
    return res.status(400).send('No metadata was provided.')

  try {
    /* Block STT request*/
    const options = prepareRequest(req.files.file)
    const transcribe = await request.post(process.env.STT_HOST, options)
    /* End block STT request*/

    /* Block STT wrapper*/
    let conversation = SttWrapper.sttToConversation(transcribe, req.body)
    await SttWrapper.addFileMetadataToConversation(conversation, req.files.file)
    /* End block STT wrapper*/

    /* Store file on disk*/
    conversation.audio.filePath = await StoreFile.storeFile(req.files.file)
    /*End store file on disk*/

    /* Storing conversation to DB */
    await convoModel.createConversation(conversation)
    /*End storing conversation to DB */

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