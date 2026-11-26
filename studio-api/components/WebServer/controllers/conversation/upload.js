const debug = require("debug")(
  "linto:components:WebServer:controllers:conversation:upload",
)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const saas = require(`${process.cwd()}/lib/saas`)

const { storeFile, deleteFile, STORE_TYPE } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { downloadAudio } = require(
  `${process.cwd()}/components/WebServer/controllers/files/urlExtractor`,
)
const { addAudioDuration } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
  ConversationError,
  ConversationNoFileUploaded,
  ConversationMetadataRequire,
  ConversationNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

const FormData = require("form-data")

const utf8 = require("utf8")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")

async function prepareFileFormData(files, url) {
  try {
    const form = new FormData()
    let file_data = {}

    if (url) {
      const ddlFileData = await downloadAudio(url, "all")
      file_data = await storeFile(ddlFileData, STORE_TYPE.AUDIO)
      form.append("file", fs.readFileSync(file_data.storageFilePath), {
        filename: file_data.filename,
      })
    } else if (Array.isArray(files?.file)) {
      for (const file of files.file) {
        form.append("file", file.data, { filename: uuidv4() })
      }
      file_data = await storeFile(files, STORE_TYPE.MULTI_AUDIO)
    } else if (files?.file) {
      const fileData = { ...files.file, name: utf8.decode(files.file.name) }
      file_data = await storeFile(fileData, STORE_TYPE.AUDIO)
      form.append("file", files.file.data, { filename: uuidv4() })
    } else {
      throw new ConversationNoFileUploaded()
    }

    return { form, file_data }
  } catch (err) {
    throw err
  }
}

async function validateConversation(conversationId, projection) {
  if (!conversationId) {
    throw new ConversationMetadataRequire("conversationId param is required")
  }

  const conversation = await model.conversations.getById(
    conversationId,
    projection,
  )
  if (conversation.length !== 1) throw new ConversationNotFound()
  return conversation[0]
}

function getTranscriptionService(endpoint, isSingleFile) {
  if (!endpoint) {
    throw new ConversationError("Transcription endpoint is required")
  }
  return `${process.env.GATEWAY_SERVICES}/${endpoint}${isSingleFile ? "/transcribe" : "/transcribe-multi"}`
}

async function prepareTranscriptionRequest(
  conversation,
  isSingleFile,
  headers = {},
) {
  const filePath = `${process.cwd()}/${process.env.VOLUME_FOLDER}/${conversation.metadata.audio.filepath}`
  const fileBuffer = fs.readFileSync(filePath)
  const form = new FormData()

  form.append("file", fileBuffer, {
    filename: conversation.metadata.audio.filepath.split("/").pop(),
    contentType: "application/octet-stream",
  })

  return prepareRequest(
    form,
    conversation.metadata.transcription.transcriptionConfig,
    isSingleFile,
    headers,
  )
}

function prepareRequest(
  form,
  transcriptionConfig,
  isSingleFile = true,
  headers = {},
) {
  const configKey = isSingleFile
    ? "transcriptionConfig"
    : "multiTranscriptionConfig"
  const configValue =
    typeof transcriptionConfig === "string"
      ? transcriptionConfig
      : JSON.stringify(transcriptionConfig)

  form.append(configKey, configValue || "{}")

  return {
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "application/json",
      ...headers,
    },
    formData: form,
    encoding: null,
  }
}

const IMPORT_CAPABILITY = "import.minutes"

// 0 when the duration cannot be read
async function probeSeconds(file_data) {
  try {
    const probed = await addAudioDuration({ metadata: {} }, file_data)
    return probed?.metadata?.audio?.duration || 0
  } catch (e) {
    debug(`import duration probe failed: ${e && e.message}`)
    return 0
  }
}

// The stored file is removed when the dispatch fails
async function dispatchUpload({
  files,
  url,
  requireDuration,
  endpoint,
  transcriptionConfig,
  isSingleFile = true,
  headers,
  organizationId,
  userId,
}) {
  const { form, file_data } = await prepareFileFormData(files, url)
  try {
    // Only measured when someone reads it: the SaaS plugin, or the caller
    let seconds = 0
    if (saas.enabled() || requireDuration) {
      seconds = await probeSeconds(file_data)
    }
    if (requireDuration && !seconds) {
      throw new ConversationError("Audio duration could not be read")
    }

    // SaaS gate: the plugin refuses (402) before the ASR is paid for. No-op
    // in OSS.
    await saas.enforce({
      orgId: organizationId,
      capability: IMPORT_CAPABILITY,
      seconds,
      userId,
    })

    const options = prepareRequest(
      form,
      transcriptionConfig,
      isSingleFile,
      headers,
    )
    const processingJob = await axios.postFormData(
      getTranscriptionService(endpoint, isSingleFile),
      options,
    )
    if (!processingJob?.jobid) {
      throw new ConversationError("Processing job ID is required")
    }
    return { processingJob, file_data, seconds }
  } catch (err) {
    deleteFile(file_data.storageFilePath)
    throw err
  }
}

// SaaS metering: the audio ingested. No-op in OSS.
async function recordUpload({ organizationId, userId, seconds, ref }) {
  await saas.record({
    orgId: organizationId,
    userId,
    capability: IMPORT_CAPABILITY,
    seconds,
    ref,
  })
}

module.exports = {
  dispatchUpload,
  recordUpload,
  getTranscriptionService,
  prepareFileFormData,
  prepareTranscriptionRequest,
  prepareRequest,
  validateConversation,
}
