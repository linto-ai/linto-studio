const debug = require("debug")(
  `linto:components:WebServer:routecontrollers:organizations:uploader:transcriptor`,
)
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

const { dispatchUpload, recordUpload } = require(
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
  ConversationSecurityLevelForbidden,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)
const { OrganizationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)
const { getTranscriptionServiceByEndpoint } = require(
  `${process.cwd()}/components/WebServer/controllers/services/utility`,
)
const { requireParam } = require(`${process.cwd()}/lib/utility/requireParam`)

const { applySpeakerIdentification, parseCollectionIds } = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/injection`,
)
const { openToAppend } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/partial`,
)
const { transcribeSync } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/syncUpload.js`,
)

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
    req.body.sync = String(req.body.sync) === "true"

    // Nothing is created to carry a name
    if (!req.body.sync) {
      requireParam(
        req.body.name,
        ConversationMetadataRequire,
        "name param is required",
      )
    }
    requireParam(
      req.body.lang,
      ConversationMetadataRequire,
      "lang param is required",
    )
    requireParam(
      req.body.endpoint,
      ConversationMetadataRequire,
      "serviceEndpoint param is required",
    )

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

    req.body.partial = String(req.body.partial) === "true"
    if (req.body.partial && req.body.sync) {
      throw new ConversationMetadataRequire(
        "A conversation cannot be both partial and sync",
      )
    }
    if (
      (req.body.partial || req.body.sync) &&
      (req.body.url || !isSingleFile)
    ) {
      throw new ConversationMetadataRequire(
        "partial and sync require a single uploaded file",
      )
    }

    const orgExists = await model.organizations.getByIdAndUser(
      req.params.organizationId,
      userId,
      { bypass: req.backofficeAccess },
    )
    if (orgExists.length !== 1) throw new OrganizationNotFound()

    // Confidentiality is enforced server-side here — the frontend gate is only
    // advisory. The conversation level cannot go below the organization's floor,
    // and the chosen transcription model's security_level must meet that level.
    req.body.securityLevel = Math.max(
      SECURITY_LEVELS.getValueOrDefault(req.body.securityLevel),
      SECURITY_LEVELS.getValueOrDefault(orgExists[0].securityLevel),
    )
    const chosenService = await getTranscriptionServiceByEndpoint(
      req.body.endpoint,
    )
    if (
      !chosenService ||
      !SECURITY_LEVELS.isAllowed(
        chosenService.security_level,
        req.body.securityLevel,
      )
    ) {
      throw new ConversationSecurityLevelForbidden()
    }

    // Speaker identification: validate the requested collections and inject the
    // server-built config into transcriptionConfig (the client never provides
    // Qdrant collection names). Returns the security headers for the gateway.
    const speakerId = await applySpeakerIdentification(req.body, orgExists[0])
    req.body.transcriptionConfig = JSON.stringify(speakerId.transcriptionConfig)
    // Keep the security headers (which may carry the shared X-Speaker-Id-Token)
    // in a local variable: never stash them on req.body, where they could ride
    // along into a log payload (cf. logger/context.js DELETE body capture).
    const speakerIdHeaders = speakerId.headers

    if (req.body.sync) {
      await transcribeSync(req, res, speakerIdHeaders)
      return
    }

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

    const { processingJob, file_data, seconds } = await dispatchUpload({
      files: req.files,
      url: req.body.url,
      endpoint: req.body.endpoint,
      transcriptionConfig: req.body.transcriptionConfig,
      isSingleFile,
      headers: speakerIdHeaders,
      organizationId: req.params.organizationId,
      userId,
    })
    req.body.file_data = file_data

    let conversation
    try {
      conversation = await createConversation(processingJob, req.body)
    } catch (err) {
      deleteFile(file_data.storageFilePath)
      throw err
    }

    await recordUpload({
      organizationId: req.params.organizationId,
      userId,
      seconds,
      ref: { conversationId: conversation._id.toString() },
    })

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

    if (body.partial) {
      openToAppend(conversation)
      // Kept to transcribe the next parts with the same speaker identification
      conversation.metadata.transcription.speakerIdentificationCollections =
        parseCollectionIds(body.speakerIdentificationCollections)
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
