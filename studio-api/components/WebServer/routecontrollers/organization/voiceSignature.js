const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  deleteFile,
  getStorageFolder,
  getVoiceSignaturesFolder,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  VoiceSignatureError,
  VoiceSignatureNotFound,
  VoiceSignatureConflict,
  VoiceSignatureUnsupportedMediaType,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/voiceSignature`,
)

const MAX_AUDIO_SIZE = 5 * 1024 * 1024 // 5MB
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

function validateAudioFile(audioFile) {
  if (!ALLOWED_AUDIO_TYPES.includes(audioFile.mimetype)) {
    throw new VoiceSignatureUnsupportedMediaType(
      `Unsupported audio format: ${audioFile.mimetype}. Allowed: ${ALLOWED_AUDIO_TYPES_STR}`,
    )
  }

  if (audioFile.size > MAX_AUDIO_SIZE) {
    throw new VoiceSignatureError(
      `Audio file too large. Maximum size: ${MAX_AUDIO_SIZE / 1024 / 1024}MB`,
    )
  }
}

async function storeVoiceSignatureFile(audioFile) {
  const folder = getVoiceSignaturesFolder()
  const storePath = `${getStorageFolder()}/${folder}`

  await fs.promises.mkdir(storePath, { recursive: true })

  const fileName = uuidv4()
  const ext = path.extname(audioFile.name) || ".webm"
  const fullPath = `${storePath}/${fileName}${ext}`

  await fs.promises.writeFile(fullPath, audioFile.data)

  return `${folder}/${fileName}${ext}`
}

async function getVoiceSignatures(req, res, next) {
  try {
    const signatures = await model.voiceSignatures.getByOrganizationId(
      req.params.organizationId,
    )
    res.status(200).send(signatures)
  } catch (err) {
    next(err)
  }
}

async function getVoiceSignature(req, res, next) {
  try {
    const signature = await model.voiceSignatures.getById(
      req.params.voiceSignatureId,
    )
    if (signature.length === 0) throw new VoiceSignatureNotFound()
    res.status(200).send(signature[0])
  } catch (err) {
    next(err)
  }
}

async function createVoiceSignature(req, res, next) {
  try {
    if (!req.body.speakerName) {
      throw new VoiceSignatureError("speakerName is required")
    }

    if (!req.files || !req.files.audio) {
      throw new VoiceSignatureError("audio file is required")
    }

    const audioFile = req.files.audio
    validateAudioFile(audioFile)

    // Check for duplicate speaker name in this organization
    const existing = await model.voiceSignatures.getBySpeakerName(
      req.params.organizationId,
      req.body.speakerName,
    )
    if (existing.length > 0) {
      throw new VoiceSignatureConflict(
        `A voice signature for speaker "${req.body.speakerName}" already exists`,
      )
    }

    const audioFilePath = await storeVoiceSignatureFile(audioFile)

    const payload = {
      speakerName: req.body.speakerName,
      audioFilePath,
      organizationId: req.params.organizationId,
    }
    if (req.body.audioDuration) {
      payload.audioDuration = parseFloat(req.body.audioDuration)
    }

    let result
    try {
      result = await model.voiceSignatures.create(payload)
    } catch (dbErr) {
      deleteFile(`${getStorageFolder()}/${audioFilePath}`)
      throw dbErr
    }

    if (result.insertedCount !== 1) {
      deleteFile(`${getStorageFolder()}/${audioFilePath}`)
      throw new VoiceSignatureError(
        "Error during the creation of the voice signature",
      )
    }

    const created = await model.voiceSignatures.getById(
      result.insertedId.toString(),
    )
    res.status(201).send(created[0])
  } catch (err) {
    next(err)
  }
}

async function updateVoiceSignature(req, res, next) {
  try {
    const signature = await model.voiceSignatures.getById(
      req.params.voiceSignatureId,
    )
    if (signature.length === 0) throw new VoiceSignatureNotFound()

    if (req.body.speakerName) {
      // Check for duplicate speaker name
      const existing = await model.voiceSignatures.getBySpeakerName(
        req.params.organizationId,
        req.body.speakerName,
      )
      if (
        existing.length > 0 &&
        existing[0]._id.toString() !== req.params.voiceSignatureId
      ) {
        throw new VoiceSignatureConflict(
          `A voice signature for speaker "${req.body.speakerName}" already exists`,
        )
      }
      signature[0].speakerName = req.body.speakerName
    }

    // If a new audio file is uploaded, replace the old one
    let oldAudioFilePath = null
    if (req.files && req.files.audio) {
      const audioFile = req.files.audio
      validateAudioFile(audioFile)

      oldAudioFilePath = signature[0].audioFilePath
      signature[0].audioFilePath = await storeVoiceSignatureFile(audioFile)
    }

    const result = await model.voiceSignatures.update(signature[0])

    // Delete old audio file only after successful DB update
    if (oldAudioFilePath) {
      deleteFile(`${getStorageFolder()}/${oldAudioFilePath}`)
    }
    if (result.modifiedCount === 0) {
      res.status(304).send("Nothing to update")
    } else {
      const updated = await model.voiceSignatures.getById(
        req.params.voiceSignatureId,
      )
      res.status(200).send(updated[0])
    }
  } catch (err) {
    next(err)
  }
}

async function deleteVoiceSignature(req, res, next) {
  try {
    const signature = await model.voiceSignatures.getById(
      req.params.voiceSignatureId,
    )
    if (signature.length === 0) throw new VoiceSignatureNotFound()

    // Delete audio file
    if (signature[0].audioFilePath) {
      deleteFile(`${getStorageFolder()}/${signature[0].audioFilePath}`)
    }

    const result = await model.voiceSignatures.delete(
      req.params.voiceSignatureId,
    )
    if (result.deletedCount !== 1) {
      throw new VoiceSignatureError(
        "Error during the deletion of the voice signature",
      )
    }

    res.status(200).send("Voice signature deleted")
  } catch (err) {
    next(err)
  }
}

async function getVoiceSignatureAudio(req, res, next) {
  try {
    const signature = await model.voiceSignatures.getById(
      req.params.voiceSignatureId,
    )
    if (signature.length === 0) throw new VoiceSignatureNotFound()

    if (!signature[0].audioFilePath) {
      throw new VoiceSignatureNotFound("Audio file not found")
    }

    const filePath = path.resolve(
      getStorageFolder(),
      signature[0].audioFilePath,
    )
    res.sendFile(filePath)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getVoiceSignatures,
  getVoiceSignature,
  getVoiceSignatureAudio,
  createVoiceSignature,
  updateVoiceSignature,
  deleteVoiceSignature,
}
