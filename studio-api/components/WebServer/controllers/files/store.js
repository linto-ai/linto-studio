const debug = require("debug")(
  "linto:components:WebServer:controllers:files:store",
)

const { v4: uuidv4 } = require("uuid")
const fs = require("fs")
const path = require("path")

const { transformAudio, mergeAudio, hasAudioStream } = require(
  `${process.cwd()}/components/WebServer/controllers/files/transform`,
)
const { FileUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/file`,
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

const SYNC_STATE = Object.freeze({
  SYNCED: "synced",
  PENDING: "pending",
  ERROR: "error",
})

const IMAGE_MAGIC_NUMBERS = [
  {
    extension: ".png",
    offset: 0,
    bytes: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
  },
  { extension: ".jpg", offset: 0, bytes: Buffer.from([0xff, 0xd8, 0xff]) },
  { extension: ".webp", offset: 8, bytes: Buffer.from("WEBP") },
]

// Media accepted for a conversation: anything ffmpeg can turn into audio.
const MEDIA_EXTENSIONS = [
  ".wav",
  ".mp3",
  ".m4a",
  ".aac",
  ".ogg",
  ".oga",
  ".opus",
  ".flac",
  ".wma",
  ".amr",
  ".aiff",
  ".aif",
  ".caf",
  ".webm",
  ".weba",
  ".mp4",
  ".m4v",
  ".mov",
  ".mkv",
  ".avi",
  ".wmv",
  ".mpg",
  ".mpeg",
  ".3gp",
]

// Declared type first (cheap), the content is then probed once on disk.
function assertSupportedMedia(file) {
  const mimetype = (file.mimetype || "").toLowerCase()
  const extension = path.extname(file.name || "").toLowerCase()
  if (
    mimetype.startsWith("audio/") ||
    mimetype.startsWith("video/") ||
    MEDIA_EXTENSIONS.includes(extension)
  ) {
    return
  }
  throw new FileUnsupportedMediaType(
    `Unsupported media type "${mimetype || extension || "unknown"}", an audio or video file is expected`,
  )
}

async function assertAudioContent(filePath, fileName) {
  if (!(await hasAudioStream(filePath))) {
    throw new FileUnsupportedMediaType(
      `No audio stream found in "${fileName}", an audio or video file is expected`,
    )
  }
}

// Detect the image type from its content, the client file name cannot be trusted.
function detectImageExtension(data) {
  const match = IMAGE_MAGIC_NUMBERS.find(
    (magic) =>
      data.length >= magic.offset + magic.bytes.length &&
      data
        .subarray(magic.offset, magic.offset + magic.bytes.length)
        .equals(magic.bytes),
  )
  return match?.extension
}

async function storeFile(files, type = STORE_TYPE.AUDIO, name = undefined) {
  try {
    let fileName = uuidv4()
    if (name !== undefined) fileName = name

    if (type === STORE_TYPE.PICTURE) {
      const fileExtension = detectImageExtension(files.data)
      if (!fileExtension) {
        throw new FileUnsupportedMediaType(
          "Picture must be a png, jpg or webp image",
        )
      }

      fs.writeFileSync(
        `${getStorageFolder()}/${getPictureFolder()}/${fileName}${fileExtension}`,
        files.data,
      )
      return `${getPictureFolder()}/${fileName}${fileExtension}`
    } else if (type === STORE_TYPE.MULTI_AUDIO) {
      let tmp_stored_file = []

      const store_path = `${getStorageFolder()}/${getAudioFolder()}`
      const audio_merged = `${store_path}/${fileName}.mp3`

      files.file.forEach(assertSupportedMedia)
      try {
        for (const file of files.file) {
          const filePath = `${store_path}/${uuidv4()}_tmp${path.extname(file.name)}`
          fs.writeFileSync(filePath, file.data)
          tmp_stored_file.push(filePath)
          await assertAudioContent(filePath, file.name)
        }
        await mergeAudio(tmp_stored_file, audio_merged)
      } catch (err) {
        deleteFile(audio_merged)
        throw err
      } finally {
        tmp_stored_file.forEach(deleteFile)
      }

      return {
        filePath: `${process.env.VOLUME_AUDIO_PATH}/${fileName}.mp3`,
        storageFilePath: audio_merged,
        filename: fileName,
      }
    } else if (type === STORE_TYPE.AUDIO) {
      const fileExtension = path.extname(files.name)
      const store_path = `${getStorageFolder()}/${getAudioFolder()}/${fileName}`
      const output_audio = `${store_path}.mp3`

      let filePath = `${store_path}_tmp${fileExtension}` // origine file
      try {
        if (files.filePath) {
          // we are in URL mode
          filePath = files.filePath
        } else {
          assertSupportedMedia(files)
          fs.writeFileSync(filePath, files.data)
        }
        await assertAudioContent(filePath, files.name)
        await transformAudio(filePath, output_audio)
      } catch (err) {
        deleteFile(output_audio)
        throw err
      } finally {
        deleteFile(filePath)
      }

      return {
        filePath: `${process.env.VOLUME_AUDIO_PATH}/${fileName}.mp3`,
        storageFilePath: output_audio,
        filename: files.name,
      }
    } else if (type === STORE_TYPE.AUDIO_SESSION) {
      const store_path = `${getStorageFolder()}/${getAudioFolder()}/${fileName}`
      const output_audio = `${store_path}.mp3`
      let filePath = `${getStorageFolder()}/${files.filepath}`

      // The session recording is kept on failure, it cannot be re-recorded.
      try {
        await transformAudio(filePath, output_audio)
      } catch (err) {
        deleteFile(output_audio)
        throw err
      }
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

// Session recordings share the volume with the Session API as <sessionId>-<channelId>.<ext>;
// the ones a conversation still points to are kept.
async function deleteSessionAudioFiles(sessionId) {
  if (!sessionId) return
  const model = require(`${process.cwd()}/lib/mongodb/models`)
  const folder = getAudioSessionFolder()
  let entries = []
  try {
    entries = await fs.promises.readdir(`${getStorageFolder()}/${folder}`)
  } catch (error) {
    debug("Session audio folder not readable : ", folder)
    return
  }
  for (const entry of entries) {
    if (!entry.startsWith(`${sessionId}-`)) continue
    const filepath = `${folder}/${entry}`
    if ((await model.conversations.countByAudioFilepath(filepath)) === 0) {
      deleteFile(`${getStorageFolder()}/${filepath}`)
    }
  }
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
  "audio/x-m4a",
  "audio/m4a",
  "audio/aac",
]
const ALLOWED_AUDIO_TYPES_STR = ALLOWED_AUDIO_TYPES.join(", ")

function validateAudioFile(
  audioFile,
  UnsupportedMediaTypeError,
  ValidationError,
) {
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

/** Store a voice sample to disk; returns the path relative to the storage folder. */
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

/** Resolve audioFilePath inside the storage directory; null if it escapes it (path traversal). */
function resolveStoragePath(audioFilePath) {
  const filePath = path.resolve(getStorageFolder(), audioFilePath)
  const storageDir = path.resolve(getStorageFolder()) + path.sep
  if (!filePath.startsWith(storageDir)) {
    return null
  }
  return filePath
}

function deleteSampleFile(sample) {
  if (sample && sample.audioFilePath) {
    const filePath = resolveStoragePath(sample.audioFilePath)
    if (filePath) deleteFile(filePath)
  }
}

function cascadeDeleteSampleFiles(samples) {
  if (Array.isArray(samples)) {
    for (const s of samples) {
      deleteSampleFile(s)
    }
  }
}

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
  const { waveformFilePath } = require(
    `${process.cwd()}/components/WebServer/controllers/files/waveform`,
  )
  const count = await model.conversations.countByAudioFilepath(filepath)
  if (count === 0) {
    deleteFile(`${getStorageFolder()}/${filepath}`)
    deleteFile(waveformFilePath(`${getStorageFolder()}/${filepath}`))
  }
}

/** Store the audio file and create the sample document; deletes the file if creation fails. */
async function storeAndCreateSample(
  audioFile,
  payload,
  sampleModel,
  ErrorClass,
) {
  const audioFilePath = await storeVoiceSampleFile(audioFile)
  const fullPayload = { ...payload, audioFilePath, filename: audioFile.name }

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
  deleteSessionAudioFiles,
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
  SYNC_STATE,
}
