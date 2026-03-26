const debug = require("debug")("linto:components:WebServer:controllers:files:store")

const { v4: uuidv4 } = require("uuid")
const fs = require("fs")
const path = require("path")

const { transformAudio, mergeAudio, mergeChannel } = require(
  `${process.cwd()}/components/WebServer/controllers/files/transform`,
)

/*
ffmpeg -i in.whatever -vn -ar 16000 -ac 1 -b:a 96k out.mp3
ffmpeg -i in.whatever -vn -c:a aac -ar 16000 -ac 1 -b:a 64k out.m4a
ffmpeg -i in.whatever -vn -c:a libfdk_aac -ar 16000 -ac 1 -b:a 64k out.m4a (best version, requires specific build for ffmpeg)
*/

const STORE_TYPE = Object.freeze({
  PICTURE: "picture",
  AUDIO: "audio",
  MULTI_AUDIO: "multi_audio",
  AUDIO_SESSION: "audio_session",
})

const COLLECTION_TYPE = Object.freeze({
  CUSTOM: "custom",
  ORGANIZATION: "organization",
})

const VOICE_SAMPLE_TYPE = Object.freeze({
  LABEL: "label",
  USER: "user",
})

const STORAGE_MODE = Object.freeze({
  AUDIO: "audio",
  EMBEDDINGS: "embeddings",
})


async function storeFile(files, type = STORE_TYPE.AUDIO, name = undefined) {
  try {
    let fileName = uuidv4()
    if (name !== undefined) fileName = name

    if (type === STORE_TYPE.PICTURE) {
      const fileExtension = path.extname(files.name)

      fs.writeFileSync(
        `${getStorageFolder()}/${getPictureFolder()}/${fileName}${fileExtension}`,
        files.data,
      )
      return `${getPictureFolder()}/${fileName}${fileExtension}`
    } else if (type === STORE_TYPE.MULTI_AUDIO) {
      let tmp_stored_file = []

      const store_path = `${getStorageFolder()}/${getAudioFolder()}`
      const audio_merged = `${store_path}/${fileName}.mp3`
      const audio_merged_channel = `${store_path}_multiple_chanel.mp3`

      files.file.map((file) => {
        const filePath = `${store_path}/${uuidv4()}_tmp${path.extname(file.name)}`
        fs.writeFileSync(filePath, file.data)
        tmp_stored_file.push(filePath)
      })

      await mergeAudio(tmp_stored_file, audio_merged)
      // await mergeChannel(tmp_stored_file, audio_merged_channel)

      tmp_stored_file.map((tmp_file) => {
        deleteFile(tmp_file)
      })

      return {
        filePath: `${process.env.VOLUME_AUDIO_PATH}/${fileName}.mp3`,
        storageFilePath: audio_merged,
        storageFilePathChanel: audio_merged_channel,
        filename: fileName,
      }
    } else if (type === STORE_TYPE.AUDIO) {
      const fileExtension = path.extname(files.name)
      const store_path = `${getStorageFolder()}/${getAudioFolder()}/${fileName}`
      const output_audio = `${store_path}.mp3`

      let filePath = `${store_path}_tmp${fileExtension}` // origine file
      if (files.filePath) {
        // we are in URL mode
        filePath = files.filePath
        await transformAudio(files.filePath, output_audio)
      } else {
        fs.writeFileSync(filePath, files.data)
        await transformAudio(filePath, output_audio)
      }

      deleteFile(filePath)
      return {
        filePath: `${process.env.VOLUME_AUDIO_PATH}/${fileName}.mp3`,
        storageFilePath: output_audio,
        filename: files.name,
      }
    } else if (type === STORE_TYPE.AUDIO_SESSION) {
      const store_path = `${getStorageFolder()}/${getAudioFolder()}/${fileName}`
      const output_audio = `${store_path}.mp3`
      let filePath = `${getStorageFolder()}/${files.filepath}`

      await transformAudio(filePath, output_audio)
      deleteFile(filePath)

      return {
        filename: fileName + ".mp3",
        filePath: `${process.env.VOLUME_AUDIO_PATH}/${fileName}.mp3`,
        storageFilePath: output_audio,
      }
    }
  } catch (error) {
    throw error
  }
}

function defaultPicture() {
  return `pictures/default.jpg`
}

function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath)
  } catch (error) {
    debug("File not found for deletion : ", filePath)
  }
}

function getStorageFolder() {
  return process.env.VOLUME_FOLDER
}

function getPictureFolder() {
  return process.env.VOLUME_PROFILE_PICTURE_PATH
}

function getAudioFolder() {
  return process.env.VOLUME_AUDIO_PATH
}

function getAudioSessionFolder() {
  return process.env.VOLUME_AUDIO_SESSION_PATH
}

function getVoiceSamplesFolder() {
  return process.env.VOLUME_VOICE_SIGNATURES_PATH
}

const MAX_AUDIO_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_AUDIO_DURATION = 600 // 10 minutes
const ALLOWED_AUDIO_TYPES = [
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mp3",
  "audio/mpeg",
  "audio/webm",
  "audio/ogg",
  "audio/flac",
  "audio/mp4",
]
const ALLOWED_AUDIO_TYPES_STR = ALLOWED_AUDIO_TYPES.join(", ")

/**
 * Validate an audio file's mimetype and size.
 * @param {object} audioFile - express-fileupload file object
 * @param {Function} UnsupportedMediaTypeError - error class for unsupported format
 * @param {Function} ValidationError - error class for size/other validation errors
 */
function validateAudioFile(audioFile, UnsupportedMediaTypeError, ValidationError) {
  if (!ALLOWED_AUDIO_TYPES.includes(audioFile.mimetype)) {
    throw new UnsupportedMediaTypeError(
      `Unsupported audio format: ${audioFile.mimetype}. Allowed: ${ALLOWED_AUDIO_TYPES_STR}`,
    )
  }

  if (audioFile.size > MAX_AUDIO_SIZE) {
    throw new ValidationError(
      `Audio file too large. Maximum size: ${MAX_AUDIO_SIZE / 1024 / 1024}MB`,
    )
  }
}

/**
 * Store a voice sample audio file to disk.
 * @param {object} audioFile - express-fileupload file object
 * @returns {string} relative path within storage folder
 */
async function storeVoiceSampleFile(audioFile) {
  const folder = getVoiceSamplesFolder()
  const storePath = `${getStorageFolder()}/${folder}`

  await fs.promises.mkdir(storePath, { recursive: true })

  const fileName = uuidv4()
  const ext = path.extname(audioFile.name) || ".webm"
  const fullPath = `${storePath}/${fileName}${ext}`

  await fs.promises.writeFile(fullPath, audioFile.data)

  return `${folder}/${fileName}${ext}`
}

/**
 * Resolve a relative audioFilePath to an absolute path within the storage directory.
 * Returns null if the resolved path escapes the storage directory (path traversal).
 * @param {string} audioFilePath - relative path within storage
 * @returns {string|null} absolute path or null if invalid
 */
function resolveStoragePath(audioFilePath) {
  const filePath = path.resolve(getStorageFolder(), audioFilePath)
  const storageDir = path.resolve(getStorageFolder()) + path.sep
  if (!filePath.startsWith(storageDir)) {
    return null
  }
  return filePath
}

/**
 * Delete a single sample's audio file from disk.
 * @param {object} sample - sample doc with audioFilePath field
 */
function deleteSampleFile(sample) {
  if (sample && sample.audioFilePath) {
    const filePath = resolveStoragePath(sample.audioFilePath)
    if (filePath) deleteFile(filePath)
  }
}

/**
 * Delete audio files from an array of sample documents.
 * @param {Array} samples - array of sample docs with audioFilePath field
 */
function cascadeDeleteSampleFiles(samples) {
  if (Array.isArray(samples)) {
    for (const s of samples) {
      deleteSampleFile(s)
    }
  }
}

/**
 * Parse and validate an audio duration value from request body.
 * @param {*} rawDuration - raw value from req.body.audioDuration
 * @returns {number|undefined} validated duration or undefined
 */
function parseAudioDuration(rawDuration) {
  if (!rawDuration) return undefined
  const duration = parseFloat(rawDuration)
  if (!isNaN(duration) && duration >= 0 && duration <= MAX_AUDIO_DURATION) {
    return duration
  }
  return undefined
}

async function deleteAudioFileIfOrphaned(filepath) {
  if (!filepath) return
  const model = require(`${process.cwd()}/lib/mongodb/models`)
  const count = await model.conversations.countByAudioFilepath(filepath)
  if (count === 0) {
    deleteFile(`${getStorageFolder()}/${filepath}`)
  }
}

/**
 * Store an audio file, create a voice sample document, and rollback on failure.
 * @param {object} audioFile - express-fileupload file object
 * @param {object} payload - fields to merge into the sample document
 * @param {object} sampleModel - the voiceSamples model instance
 * @param {Function} ErrorClass - error class to throw on creation failure
 * @returns {object} the created sample document
 */
async function storeAndCreateSample(audioFile, payload, sampleModel, ErrorClass) {
  const audioFilePath = await storeVoiceSampleFile(audioFile)
  const fullPayload = { ...payload, audioFilePath }

  const result = await sampleModel.create(fullPayload)

  if (!result || result.insertedCount !== 1) {
    deleteFile(`${getStorageFolder()}/${audioFilePath}`)
    throw new ErrorClass("Error during the creation of the voice sample")
  }

  const created = await sampleModel.getById(result.insertedId.toString())
  return created[0]
}

module.exports = {
  storeFile,
  defaultPicture,
  deleteFile,
  deleteAudioFileIfOrphaned,
  getStorageFolder,
  getPictureFolder,
  getAudioFolder,
  validateAudioFile,
  resolveStoragePath,
  deleteSampleFile,
  cascadeDeleteSampleFiles,
  parseAudioDuration,
  STORE_TYPE,
  COLLECTION_TYPE,
  storeAndCreateSample,
  VOICE_SAMPLE_TYPE,
  STORAGE_MODE,
}
