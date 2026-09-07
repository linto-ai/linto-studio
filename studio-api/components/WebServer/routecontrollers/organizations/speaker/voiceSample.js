const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  validateAudioFile: _validateAudioFile,
  resolveStoragePath,
  deleteSampleFile,
  parseAudioDuration,
  storeAndCreateSample,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  VoiceSampleError,
  VoiceSampleNotFound,
  VoiceSampleUnsupportedMediaType,
  SpeakerLabelNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerIdentification`,
)

const { verifyOwnership } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/speaker/voiceprintCollection`,
)
const triggers = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
)
const limits = require(`${process.cwd()}/lib/dao/speakerIdentification/limits`)

function validateAudioFile(audioFile) {
  _validateAudioFile(audioFile, VoiceSampleUnsupportedMediaType, VoiceSampleError)
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

async function verifySampleInLabel(sampleId, organizationId, collectionId, labelId) {
  const sample = await verifyOwnership(
    model.voiceSamples, sampleId, organizationId, VoiceSampleNotFound,
  )
  if (
    sample.collectionId.toString() !== collectionId ||
    sample.speakerLabelId.toString() !== labelId
  ) {
    throw new VoiceSampleNotFound()
  }
  return sample
}

async function getVoiceSamples(req, res, next) {
  try {
    await verifyLabelInCollection(
      req.params.labelId, req.params.organizationId, req.params.collectionId,
    )

    const samples = await model.voiceSamples.getBySpeakerLabelId(
      req.params.labelId,
    )
    res.status(200).send(samples)
  } catch (err) {
    next(err)
  }
}

async function getVoiceSample(req, res, next) {
  try {
    const sample = await verifySampleInLabel(
      req.params.voiceSampleId, req.params.organizationId,
      req.params.collectionId, req.params.labelId,
    )
    res.status(200).send(sample)
  } catch (err) {
    next(err)
  }
}

async function createVoiceSample(req, res, next) {
  try {
    if (!req.files || !req.files.audio) {
      throw new VoiceSampleError("audio file is required")
    }

    const label = await verifyLabelInCollection(
      req.params.labelId, req.params.organizationId, req.params.collectionId,
    )

    const audioFile = req.files.audio
    validateAudioFile(audioFile)

    // Quantitative limits per label (07 §5 Q8)
    const existingSamples = await model.voiceSamples.getBySpeakerLabelId(
      req.params.labelId,
    )
    if (existingSamples.length >= limits.maxSamplesPerLabel()) {
      throw new VoiceSampleError(
        `Maximum number of voice samples per speaker reached (${limits.maxSamplesPerLabel()})`,
      )
    }

    const payload = {
      speakerLabelId: req.params.labelId,
      collectionId: label.collectionId.toString(),
      organizationId: req.params.organizationId,
    }
    const audioDuration = parseAudioDuration(req.body.audioDuration)
    if (audioDuration !== undefined) {
      const totalDuration = existingSamples.reduce(
        (sum, s) => sum + (s.audioDuration || 0),
        0,
      )
      if (totalDuration + audioDuration > limits.maxTotalDurationPerLabel()) {
        throw new VoiceSampleError(
          `Maximum total duration of voice samples per speaker reached (${limits.maxTotalDurationPerLabel()}s)`,
        )
      }
      payload.audioDuration = audioDuration
    }

    const created = await storeAndCreateSample(
      audioFile, payload, model.voiceSamples, VoiceSampleError,
    )

    // Recompute the label voiceprint and re-upsert it in Qdrant
    // (fire-and-forget; syncState reflects progress).
    triggers.recomputeLabel(label)

    res.status(201).send(created)
  } catch (err) {
    next(err)
  }
}

async function deleteVoiceSample(req, res, next) {
  try {
    const label = await verifyLabelInCollection(
      req.params.labelId, req.params.organizationId, req.params.collectionId,
    )
    const sample = await verifySampleInLabel(
      req.params.voiceSampleId, req.params.organizationId,
      req.params.collectionId, req.params.labelId,
    )

    deleteSampleFile(sample)

    const result = await model.voiceSamples.delete(
      req.params.voiceSampleId,
    )
    if (result.deletedCount !== 1) {
      throw new VoiceSampleError(
        "Error during the deletion of the voice sample",
      )
    }

    // Recompute the label voiceprint from the remaining samples (the
    // voiceprint is kept untouched when no sample remains, 04 §6a).
    triggers.recomputeLabel(label)

    res.status(200).send("Voice sample deleted")
  } catch (err) {
    next(err)
  }
}

async function getVoiceSampleAudio(req, res, next) {
  try {
    const sample = await verifySampleInLabel(
      req.params.voiceSampleId, req.params.organizationId,
      req.params.collectionId, req.params.labelId,
    )

    if (!sample.audioFilePath) {
      throw new VoiceSampleNotFound("Audio file not found")
    }

    const filePath = resolveStoragePath(sample.audioFilePath)
    if (!filePath) {
      throw new VoiceSampleNotFound("Audio file not found")
    }

    res.sendFile(filePath)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getVoiceSamples,
  getVoiceSample,
  getVoiceSampleAudio,
  createVoiceSample,
  deleteVoiceSample,
}
