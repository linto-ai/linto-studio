const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:routeControllers:conversation:transcriptor`,
)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const { prepareFileFormData, prepareRequest } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const fs = require("fs")
const path = require("path")
const FormData = require("form-data")

const {
  ConversationNotFound,
  ConversationMetadataRequire,
  ConversationError,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

// From the audio of a session
// From the audio of an empty session
// From a conversation who we want to regenerate
async function offlineReq(req, res, next) {
  try {
    if (!req.params.conversationId)
      throw new ConversationMetadataRequire("conversationId param is required")

    if (req.query.regenerate === "true") {
      // We redo the transcription of the conversation
      let conversation = await model.conversations.getById(
        req.params.conversationId,
      )
      if (conversation.length !== 1) throw new ConversationNotFound()
      conversation = conversation[0]
      req.body.transcriptionConfig =
        conversation.metadata.transcription.transcriptionConfig

      if (!conversation?.metadata?.transcription?.endpoint) {
        throw new ConversationError("Transcription endpoint is require")
      }
      const transcriptionService = `${process.env.GATEWAY_SERVICES}/${conversation.metadata.transcription.endpoint}/transcribe`

      // Read file as a Buffer instead of using a stream
      const fileBuffer = fs.readFileSync(
        `${process.cwd()}/${process.env.VOLUME_FOLDER}/${conversation.metadata.audio.filepath}`,
      )
      const form = new FormData()
      form.append("file", fileBuffer, {
        filename: conversation.metadata.audio.filepath.split("/").pop(),
        contentType: "application/octet-stream",
      })
      const options = await prepareRequest(
        form,
        conversation.metadata.transcription.transcriptionConfig,
      )

      const processing_job = await axios.postFormData(
        transcriptionService,
        options,
      )

      cleanConversation(conversation, processing_job)
    }

    res.status(200).send({
      message: "A conversation is currently being processed",
    })
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
      steps: {},
      endpoint: conversation.metadata.transcription.endpoint,
    },
    keyword: {},
  }
  await model.conversations.update(conversation)
}

module.exports = {
  offlineReq,
}
