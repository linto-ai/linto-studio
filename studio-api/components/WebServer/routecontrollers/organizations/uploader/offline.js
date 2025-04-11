const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:routeControllers:conversation:transcriptor`,
)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const { storeFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const {
  validateConversation,
  getTranscriptionService,
  prepareTranscriptionRequest,
} = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
)

const { addFileMetadataToConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
)

const fs = require("fs")
const model = require(`${process.cwd()}/lib/mongodb/models`)

async function offline(conversation, isConversation = true) {
  try {
    const transcriptionService = getTranscriptionService(
      conversation.metadata.transcription.endpoint,
      true,
    )
    const options = await prepareTranscriptionRequest(conversation, true)
    const processingJob = await axios.postFormData(
      transcriptionService,
      options,
    )
    conversation = await cleanConversation(conversation, processingJob)

    if (isConversation) {
      await model.conversations.update(conversation)
    }

    const audio = conversation.metadata.audio
    if (audio.mimetype === "audio/wav" || audio.filename.endsWith(".wav")) {
      let file_data = await storeFile(
        conversation.metadata.audio,
        "audio_session",
        conversation.type.from_session_id,
      )
      conversation = await addFileMetadataToConversation(
        conversation,
        file_data,
        conversation.metadata.transcription.endpoint,
      )
      await model.conversations.update(conversation)
    }

    return conversation
  } catch (err) {
    throw err
  }
}

async function sessionReq(conversationId) {
  try {
    let conversation = await validateConversation(conversationId)
    const filePath = `${process.cwd()}/${process.env.VOLUME_FOLDER}/${conversation.metadata.audio.filepath}`
    if (!filePath) return

    let attempts = 0
    const maxAttempts = 5
    const delay = 2000

    while (attempts < maxAttempts) {
      if (fs.existsSync(filePath)) break
      await new Promise((resolve) => setTimeout(resolve, delay))
      attempts++
    }
    if (attempts === maxAttempts) return
    offline(conversation, false)
  } catch (err) {
    debug(err)
  }
}

async function offlineReq(req, res, next) {
  try {
    const conversation = await validateConversation(req.params.conversationId)
    offline(conversation, true)

    res
      .status(200)
      .send({ message: "A conversation is currently being processed" })
  } catch (err) {
    next(err)
  }
}

async function cleanConversation(conversation, processing_job) {
  conversation.text = []
  conversation.speakers = []

  conversation.jobs = {
    transcription: {
      job_id: processing_job.jobid,
      state: "pending",
      endpoint: conversation.metadata.transcription.endpoint,
    },
    keyword: {},
  }
  return conversation
}

module.exports = {
  offlineReq,
  sessionReq,
}
