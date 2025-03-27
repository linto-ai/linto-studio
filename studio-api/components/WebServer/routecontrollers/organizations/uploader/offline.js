const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:routeControllers:conversation:transcriptor`,
)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const {
  validateConversation,
  getTranscriptionService,
  prepareTranscriptionRequest,
} = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

async function offlineReq(req, res, next) {
  try {
    const conversation = await validateConversation(req.params.conversationId)
    req.body.transcriptionConfig =
      conversation.metadata.transcription.transcriptionConfig

    const transcriptionService = getTranscriptionService(
      conversation.metadata.transcription.endpoint,
      true,
    )
    const options = await prepareTranscriptionRequest(conversation, true)

    const processingJob = await axios.postFormData(
      transcriptionService,
      options,
    )
    await cleanConversation(conversation, processingJob)

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
