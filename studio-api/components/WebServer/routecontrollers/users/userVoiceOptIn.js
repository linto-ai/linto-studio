const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  deleteFile,
  getStorageFolder,
  validateAudioFile: _validateAudioFile,
  storeVoiceSignatureFile,
  resolveStoragePath,
  deleteSignatureFile,
  cascadeDeleteSignatureFiles,
  parseAudioDuration,
  VOICE_SIGNATURE_TYPE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  UserVoiceSignatureError,
  UserVoiceSignatureNotFound,
  UserVoiceSignatureUnsupportedMediaType,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerDiarization`,
)

function validateAudioFile(audioFile) {
  _validateAudioFile(audioFile, UserVoiceSignatureUnsupportedMediaType, UserVoiceSignatureError)
}

async function createUserVoiceSignature(req, res, next) {
  try {
    const userId = req.payload.data.userId

    if (!req.files || !req.files.audio) {
      throw new UserVoiceSignatureError("audio file is required")
    }

    const audioFile = req.files.audio
    validateAudioFile(audioFile)

    const audioFilePath = await storeVoiceSignatureFile(audioFile)

    const payload = {
      type: VOICE_SIGNATURE_TYPE.USER,
      userId,
      audioFilePath,
    }
    const audioDuration = parseAudioDuration(req.body.audioDuration)
    if (audioDuration !== undefined) {
      payload.audioDuration = audioDuration
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
      throw new UserVoiceSignatureError(
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

async function getUserVoiceSignatures(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const signatures = await model.voiceSignatures.getByUserId(userId)
    res.status(200).send(signatures)
  } catch (err) {
    next(err)
  }
}

async function resolveUserSignatureAudio(sigId, userId) {
  const result = await model.voiceSignatures.getById(sigId)
  if (result.length === 0) {
    throw new UserVoiceSignatureNotFound()
  }
  const signature = result[0]
  if (signature.userId !== userId) {
    throw new UserVoiceSignatureNotFound()
  }
  if (!signature.audioFilePath) {
    throw new UserVoiceSignatureNotFound("Audio file not found")
  }
  const filePath = resolveStoragePath(signature.audioFilePath)
  if (!filePath) {
    throw new UserVoiceSignatureNotFound("Audio file not found")
  }
  return filePath
}

async function getUserVoiceSignatureAudio(req, res, next) {
  try {
    const filePath = await resolveUserSignatureAudio(
      req.params.id, req.payload.data.userId,
    )
    res.sendFile(filePath)
  } catch (err) {
    next(err)
  }
}

async function deleteUserVoiceSignature(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const sigId = req.params.id

    const result = await model.voiceSignatures.getById(sigId)
    if (result.length === 0) {
      throw new UserVoiceSignatureNotFound()
    }

    const signature = result[0]
    if (signature.userId !== userId) {
      throw new UserVoiceSignatureNotFound()
    }

    deleteSignatureFile(signature)

    const deleteResult = await model.voiceSignatures.delete(sigId)
    if (deleteResult.deletedCount !== 1) {
      throw new UserVoiceSignatureError(
        "Error during the deletion of the voice signature",
      )
    }

    res.status(200).send("Voice signature deleted")
  } catch (err) {
    next(err)
  }
}

async function deleteAllUserVoiceSignatures(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const signatures = await model.voiceSignatures.getByUserId(userId)
    cascadeDeleteSignatureFiles(signatures)
    await model.voiceSignatures.deleteAllFromUser(userId)

    res.status(200).send("All voice signatures deleted")
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createUserVoiceSignature,
  getUserVoiceSignatures,
  getUserVoiceSignatureAudio,
  deleteUserVoiceSignature,
  deleteAllUserVoiceSignatures,
  resolveUserSignatureAudio,
}
