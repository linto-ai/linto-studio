const { storeFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { downloadAudio } = require(
  `${process.cwd()}/components/WebServer/controllers/files/urlExtractor`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

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
      file_data = await storeFile(ddlFileData, "audio")
      form.append("file", fs.readFileSync(file_data.storageFilePath), {
        filename: file_data.filename,
      })
    } else if (Array.isArray(files?.file)) {
      for (const file of files.file) {
        form.append("file", file.data, { filename: uuidv4() })
      }
      file_data = await storeFile(files, "multi_audio")
    } else if (files?.file) {
      const fileData = { ...files.file, name: utf8.decode(files.file.name) }
      file_data = await storeFile(fileData, "audio")
      form.append("file", files.file.data, { filename: uuidv4() })
    } else {
      throw new ConversationNoFileUploaded()
    }

    return { form, file_data }
  } catch (err) {
    throw err
  }
}

async function validateConversation(conversationId) {
  if (!conversationId) {
    throw new ConversationMetadataRequire("conversationId param is required")
  }

  const conversation = await model.conversations.getById(conversationId)
  if (conversation.length !== 1) throw new ConversationNotFound()
  return conversation[0]
}

function getTranscriptionService(endpoint, isSingleFile) {
  if (!endpoint) {
    throw new ConversationError("Transcription endpoint is required")
  }
  return `${process.env.GATEWAY_SERVICES}/${endpoint}${isSingleFile ? "/transcribe" : "/transcribe-multi"}`
}

async function prepareTranscriptionRequest(conversation, isSingleFile) {
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
  )
}

function prepareRequest(form, transcriptionConfig, isSingleFile = true) {
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
    },
    formData: form,
    encoding: null,
  }
}

module.exports = {
  getTranscriptionService,
  prepareFileFormData,
  prepareTranscriptionRequest,
  prepareRequest,
  validateConversation,
}
