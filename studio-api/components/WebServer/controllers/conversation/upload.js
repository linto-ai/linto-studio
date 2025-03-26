const { storeFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { downloadAudio } = require(
  `${process.cwd()}/components/WebServer/controllers/files/urlExtractor`,
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
  prepareFileFormData,
  prepareRequest,
}
