const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:routeControllers:conversation:transcriptor`,
)
const FormData = require("form-data")
const axios = require(`${process.cwd()}/lib/utility/axios`)
const utf8 = require("utf8")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")

const model = require(`${process.cwd()}/lib/mongodb/models`)

const { addFileMetadataToConversation, initConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
)
const { storeFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { downloadAudio } = require(
  `${process.cwd()}/components/WebServer/controllers/files/urlExtractor`,
)

const CONVERSATION_RIGHT = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
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
    if (req.body.url || (req.files && Object.keys(req.files).length !== 0)) {
      if (req.body.url)
        await transcribe(true, req, res, next) // Considered as a single file
      else if (req.files && Array.isArray(req.files.file))
        // Multifile
        await transcribe(false, req, res, next)
      // Single file
      else await transcribe(true, req, res, next)
    } else throw new ConversationNoFileUploaded()
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
    if (!req.body.membersRight || isNaN(req.body.membersRight))
      req.body.membersRight = CONVERSATION_RIGHT.READ
    else req.body.membersRight = parseInt(req.body.membersRight)
    if (!req.body.endpoint)
      throw new ConversationMetadataRequire("serviceEndpoint param is required")
    if (!req.params.organizationId)
      throw new ConversationMetadataRequire("organizationId param is required")

    if (
      (
        await model.organizations.getByIdAndUser(
          req.params.organizationId,
          userId,
        )
      ).length !== 1
    )
      throw new OrganizationNotFound()
    req.body.userId = userId
    req.body.organizationId = req.params.organizationId

    req.body.filter = {}

    let service = process.env.GATEWAY_SERVICES + "/" + req.body.endpoint
    let transcription_service = service

    const form_data = await prepareFileFormData(req.files, req.body.url)
    const options = await prepareRequest(form_data.form, req.body, isSingleFile)

    isSingleFile
      ? (transcription_service += "/transcribe")
      : (transcription_service += "/transcribe-multi")
    req.body.file_data = form_data.file_data

    const processing_job = await axios.postFormData(
      transcription_service,
      options,
    )

    await createConversation(processing_job, req.body)

    res.status(201).send({
      message: "A conversation is currently being processed",
    })
  } catch (err) {
    next(err)
  }
}

async function prepareFileFormData(files, url) {
  try {
    const form = new FormData()
    let file_data = {}
    if (url) {
      const ddlFileData = await downloadAudio(url, "all")
      file_data = await storeFile(ddlFileData, "audio")

      const fileData = fs.readFileSync(file_data.storageFilePath)
      form.append("file", fileData, { filename: file_data.filename })
    } else if (Array.isArray(files.file)) {
      for (const file of files.file) {
        form.append("file", file.data, { filename: uuidv4() })
      }
      file_data = await storeFile(files, "multi_audio")
    } else {
      const fileData = {
        ...files.file,
        name: utf8.decode(files.file.name),
      }
      file_data = await storeFile(fileData, "audio")
      form.append("file", files.file.data, { filename: uuidv4() })
    }
    return {
      form: form,
      file_data,
    }
  } catch (err) {
    throw err
  }
}

async function prepareRequest(form, body, isSingleFile) {
  if (isSingleFile && body.transcriptionConfig)
    form.append("transcriptionConfig", body.transcriptionConfig.toString())
  else if (isSingleFile) form.append("transcriptionConfig", "{}")
  else if (!isSingleFile && body.transcriptionConfig)
    form.append("multiTranscriptionConfig", body.transcriptionConfig.toString())
  else if (!isSingleFile) form.append("multiTranscriptionConfig", "{}")

  let options = {
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "application/json",
    },
    formData: form,
    encoding: null,
  }

  return options
}

async function createConversation(processing_job, body) {
  if (processing_job && processing_job.jobid) {
    let job = {
      type: "transcription",
      job_id: processing_job.jobid,
      filter: {},
    }
    let conversation = initConversation(body, body.userId, job.job_id)
    conversation = await addFileMetadataToConversation(
      conversation,
      body.file_data,
    )

    const result = await model.conversations.create(conversation)
    if (result.insertedCount !== 1) throw new ConversationError()

    //TODO: temporary workaround to create default categories
    await model.categories.createDefaultCategories(
      "keyword",
      result.insertedId.toString(),
    )

    return conversation
  }
}

module.exports = {
  transcribeReq,
}
