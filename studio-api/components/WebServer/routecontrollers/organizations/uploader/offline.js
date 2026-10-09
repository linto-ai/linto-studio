const debug = require("debug")(
  `linto:components:WebServer:routecontrollers:organizations:uploader:offline`,
)
const path = require("path")
const axios = require(`${process.cwd()}/lib/utility/axios`)
const logger = require(`${process.cwd()}/lib/logger/logger`)
const { storeFile, STORE_TYPE } = require(
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

const { applySpeakerIdentification } = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/injection`,
)

const fs = require("fs")
const model = require(`${process.cwd()}/lib/mongodb/models`)
const saas = require(`${process.cwd()}/lib/saas`)

async function offline(conversation, isConversation = true) {
  try {
    const transcriptionService = getTranscriptionService(
      conversation.metadata.transcription.endpoint,
      true,
    )

    // Inject the server-built speaker identification config, as in transcriptor.js
    const speakerIdHeaders = await injectSpeakerIdentification(conversation)
    const options = await prepareTranscriptionRequest(
      conversation,
      true,
      speakerIdHeaders,
    )
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
        audio,
        STORE_TYPE.AUDIO_SESSION,
        path.parse(audio.filename).name,
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

async function injectSpeakerIdentification(conversation) {
  const transcription = conversation.metadata.transcription
  const collections = transcription.speakerIdentificationCollections
  if (!Array.isArray(collections) || collections.length === 0) {
    return {}
  }

  const organizationId = conversation.organization?.organizationId
  if (!organizationId) {
    return {}
  }

  const organizations = await model.organizations.getById(organizationId)
  if (!Array.isArray(organizations) || organizations.length !== 1) {
    return {}
  }

  try {
    const speakerId = await applySpeakerIdentification(
      {
        transcriptionConfig: transcription.transcriptionConfig,
        speakerIdentificationCollections: collections,
      },
      organizations[0],
    )
    transcription.transcriptionConfig = speakerId.transcriptionConfig
    return speakerId.headers
  } catch (err) {
    // A speaker identification failure must not abort the transcription.
    debug("Speaker identification skipped: %s", err.message)
    return {}
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
    if (attempts === maxAttempts) {
      logger.error(
        `sessionReq: audio ${filePath} of conversation ${conversationId} never showed up, offline transcription skipped`,
      )
      return
    }
    // Read before offline(): the model update it runs strips the conversation's _id.
    const orgId = conversation.organization?.organizationId?.toString()
    const userId = conversation.owner?.toString()
    const sessionId = conversation.type?.from_session_id
    const processed = await offline(conversation, false)

    // SaaS metering: the session's converted audio is ingested like an upload.
    // No-op in OSS.
    await saas.record({
      orgId,
      userId,
      capability: "import.minutes",
      seconds: processed?.metadata?.audio?.duration || 0,
      ref: { conversationId: String(conversationId), sessionId },
    })
  } catch (err) {
    logger.error(
      `sessionReq: offline transcription of conversation ${conversationId} failed: ${err?.stack || err}`,
    )
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
