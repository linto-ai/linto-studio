const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  deleteFile,
  getStorageFolder,
  validateAudioFile: _validateAudioFile,
  storeVoiceSignatureFile,
  resolveStoragePath,
  deleteSignatureFile,
  parseAudioDuration,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  VoiceSignatureError,
  VoiceSignatureNotFound,
  VoiceSignatureUnsupportedMediaType,
  SpeakerLabelNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerDiarization`,
)

const { verifyOwnership } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/speakerLabelCollection`,
)

function validateAudioFile(audioFile) {
  _validateAudioFile(audioFile, VoiceSignatureUnsupportedMediaType, VoiceSignatureError)
}

async function verifyLabelInCollection(labelId, organizationId, collectionId) {
  const label = await verifyOwnership(
    model.speakerLabels, labelId, organizationId, SpeakerLabelNotFound,
  )
  if (label.collectionId.toString() !== collectionId) {
    throw new SpeakerLabelNotFound()
  }
  return label
}

async function verifySignatureInLabel(signatureId, organizationId, collectionId, labelId) {
  const sig = await verifyOwnership(
    model.voiceSignatures, signatureId, organizationId, VoiceSignatureNotFound,
  )
  if (
    sig.collectionId.toString() !== collectionId ||
    sig.speakerLabelId.toString() !== labelId
  ) {
    throw new VoiceSignatureNotFound()
  }
  return sig
}

async function getVoiceSignatures(req, res, next) {
  try {
    await verifyLabelInCollection(
      req.params.labelId, req.params.organizationId, req.params.collectionId,
    )

    const signatures = await model.voiceSignatures.getBySpeakerLabelId(
      req.params.labelId,
    )
    res.status(200).send(signatures)
  } catch (err) {
    next(err)
  }
}

async function getVoiceSignature(req, res, next) {
  try {
    const sig = await verifySignatureInLabel(
      req.params.voiceSignatureId, req.params.organizationId,
      req.params.collectionId, req.params.labelId,
    )
    res.status(200).send(sig)
  } catch (err) {
    next(err)
  }
}

async function createVoiceSignature(req, res, next) {
  try {
    if (!req.files || !req.files.audio) {
      throw new VoiceSignatureError("audio file is required")
    }

    const label = await verifyLabelInCollection(
      req.params.labelId, req.params.organizationId, req.params.collectionId,
    )

    const audioFile = req.files.audio
    validateAudioFile(audioFile)

    const audioFilePath = await storeVoiceSignatureFile(audioFile)

    const payload = {
      speakerLabelId: req.params.labelId,
      collectionId: label.collectionId.toString(),
      organizationId: req.params.organizationId,
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

async function deleteVoiceSignature(req, res, next) {
  try {
    const signature = await verifySignatureInLabel(
      req.params.voiceSignatureId, req.params.organizationId,
      req.params.collectionId, req.params.labelId,
    )

    deleteSignatureFile(signature)

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
    const signature = await verifySignatureInLabel(
      req.params.voiceSignatureId, req.params.organizationId,
      req.params.collectionId, req.params.labelId,
    )

    if (!signature.audioFilePath) {
      throw new VoiceSignatureNotFound("Audio file not found")
    }

    const filePath = resolveStoragePath(signature.audioFilePath)
    if (!filePath) {
      throw new VoiceSignatureNotFound("Audio file not found")
    }

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
  deleteVoiceSignature,
}
