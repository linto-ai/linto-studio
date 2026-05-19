const debug = require("debug")(
  `linto:components:WebServer:routecontrollers:organizations:uploader:transcriptor`,
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
const { requireParam } = require(`${process.cwd()}/lib/utility/requireParam`)

async function transcribeReq(req, res, next) {
  try {
    if (!(req.body.url || (req.files && Object.keys(req.files).length !== 0))) {
      throw new ConversationNoFileUploaded()
    }

    const isSingleFile =
      req.body.url || !(req.files && Array.isArray(req.files.file))
    const conversation = await transcribe(isSingleFile, req, res, next)

    if (conversation && this?.app?.components?.IoHandler)
      this.app.components.IoHandler.emit("new_conversation", conversation)
  } catch (err) {
    next(err)
  }
}

async function transcribe(isSingleFile, req, res, next) {
  try {
    const userId = req.payload.data.userId
    requireParam(req.body.name, ConversationMetadataRequire, "name param is required")
    requireParam(req.body.lang, ConversationMetadataRequire, "lang param is required")
    requireParam(req.body.endpoint, ConversationMetadataRequire, "serviceEndpoint param is required")

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

    if (req.body.folderId && req.body.folderId !== "null") {
      const folderResult = await model.folders.getById(req.body.folderId)
      if (folderResult.length === 0)
        throw new ConversationMetadataRequire("Folder not found")
      if (folderResult[0].organizationId !== req.params.organizationId)
        throw new ConversationMetadataRequire(
          "Folder belongs to another organization",
        )

      const folder = folderResult[0]
      req.body.folderId = folder._id.toString()

      if (folder.visibility === "private") {
        req.body.membersRight = CONVERSATION_RIGHT.UNDEFINED
        req.body.customRights = folder.members || []
      }
    }

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

    if (body.customRights && body.customRights.length > 0) {
      await model.conversations.update({
        _id: result.insertedId.toString(),
        "organization.customRights": body.customRights,
      })
    }

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
