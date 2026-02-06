const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:routeControllers:conversation:transcriptor`,
)
const axios = require(`${process.cwd()}/lib/utility/axios`)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const LogManager = require(`${process.cwd()}/lib/logger/manager`)

const {
  addFileMetadataToConversation,
  addAudioDuration,
  initConversation,
} = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
)

const { deleteFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

const {
  prepareFileFormData,
  prepareRequest,
  getTranscriptionService,
} = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
)

const CONVERSATION_RIGHT = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)
const SECURITY_LEVELS = require(
  `${process.cwd()}/lib/dao/conversation/securityLevels`,
)
const {
  ConversationNoFileUploaded,
  ConversationMetadataRequire,
  ConversationError,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)
const { OrganizationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

async function transcribeReq(req, res, next) {
  try {
    if (!(req.body.url || (req.files && Object.keys(req.files).length !== 0))) {
      throw new ConversationNoFileUploaded()
    }

    const isSingleFile =
      req.body.url || !(req.files && Array.isArray(req.files.file))
    const conversation = await transcribe(isSingleFile, req, res, next)

    if (this?.app?.components?.IoHandler)
      this.app.components.IoHandler.emit("new_conversation", conversation)
  } catch (err) {
    next(err)
  }
}

async function transcribe(isSingleFile, req, res, next) {
  try {
    const userId = req.payload.data.userId
    if (!req.body.name)
      throw new ConversationMetadataRequire("name param is required")
    if (!req.body.lang)
      throw new ConversationMetadataRequire("lang param is required")
    if (!req.body.endpoint)
      throw new ConversationMetadataRequire("serviceEndpoint param is required")
    if (!req.params.organizationId)
      throw new ConversationMetadataRequire("organizationId param is required")

    req.body.membersRight = isNaN(req.body.membersRight)
      ? CONVERSATION_RIGHT.READ
      : parseInt(req.body.membersRight)
    req.body.userId = userId
    req.body.organizationId = req.params.organizationId
    req.body.filter = {}

    // Parse securityLevel from string (FormData sends strings)
    if (req.body.securityLevel !== undefined && req.body.securityLevel !== "") {
      req.body.securityLevel = parseInt(req.body.securityLevel)
    }

    if (!SECURITY_LEVELS.isValid(req.body.securityLevel)) {
      throw new ConversationMetadataRequire(
        "Invalid securityLevel value. Allowed values: 0, 1, 2",
      )
    }

    const orgExists = await model.organizations.getByIdAndUser(
      req.params.organizationId,
      userId,
    )
    if (orgExists.length !== 1) throw new OrganizationNotFound()

    const transcriptionService = getTranscriptionService(
      req.body.endpoint,
      isSingleFile,
    )
    const formData = await prepareFileFormData(req.files, req.body.url)
    const options = await prepareRequest(
      formData.form,
      req.body.transcriptionConfig,
      isSingleFile,
    )
    req.body.file_data = formData.file_data

    const processingJob = await axios.postFormData(
      transcriptionService,
      options,
    )
    const conversation = await createConversation(processingJob, req.body)
    res.status(201).send({
      message: "A conversation is currently being processed",
      conversationId: conversation._id.toString(),
    })

    LogManager.logTranscriptionEvent(req, {
      conversationId: conversation._id.toString(),
      jobId: processingJob.jobid,
      query: req.body,
    })

    return conversation
  } catch (err) {
    next(err)
  }
}

async function createConversation(processing_job, body) {
  if (processing_job && processing_job.jobid) {
    let job = {
      type: "transcription",
      job_id: processing_job.jobid,
      filter: {},
    }
    let conversation = initConversation(body, body.userId, job.job_id)

    // We don't store the audio file when we it's coming from a URL
    if (body.url) {
      conversation.metadata.audio.fromUrl = body.url
      conversation.metadata.transcription.endpoint = body.endpoint
      // we want the length of the audio file
      conversation = await addAudioDuration(conversation, body.file_data)
      deleteFile(body.file_data.storageFilePath)
    } else {
      conversation = await addFileMetadataToConversation(
        conversation,
        body.file_data,
        body.endpoint,
      )
    }

    const result = await model.conversations.create(conversation)
    if (result.insertedCount !== 1) throw new ConversationError()

    await model.categories.createDefaultCategories(
      "keyword",
      result.insertedId.toString(),
    )

    return conversation
  } else {
    throw new ConversationError("Processing job ID is required")
  }
}

module.exports = {
  transcribeReq,
}
