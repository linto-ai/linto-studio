const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  validateAudioFile: _validateAudioFile,
  resolveStoragePath,
  deleteSampleFile,
  cascadeDeleteSampleFiles,
  parseAudioDuration,
  storeAndCreateSample,
  VOICE_SAMPLE_TYPE,
  STORAGE_MODE,
  COLLECTION_TYPE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  UserVoiceSampleError,
  UserVoiceSampleNotFound,
  UserVoiceSampleUnsupportedMediaType,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerIdentification`,
)

function validateAudioFile(audioFile) {
  _validateAudioFile(audioFile, UserVoiceSampleUnsupportedMediaType, UserVoiceSampleError)
}

async function verifyUserSampleOwnership(sampleId, userId) {
  const result = await model.voiceSamples.getById(sampleId)
  if (result.length === 0) {
    throw new UserVoiceSampleNotFound()
  }
  const sample = result[0]
  if (sample.userId !== userId) {
    throw new UserVoiceSampleNotFound()
  }
  return sample
}

async function createUserVoiceSample(req, res, next) {
  try {
    const userId = req.payload.data.userId

    if (!req.files || !req.files.audio) {
      throw new UserVoiceSampleError("audio file is required")
    }

    const audioFile = req.files.audio
    validateAudioFile(audioFile)

    const payload = {
      type: VOICE_SAMPLE_TYPE.USER,
      userId,
    }
    const audioDuration = parseAudioDuration(req.body.audioDuration)
    if (audioDuration !== undefined) {
      payload.audioDuration = audioDuration
    }

    const created = await storeAndCreateSample(
      audioFile, payload, model.voiceSamples, UserVoiceSampleError,
    )
    res.status(201).send(created)
  } catch (err) {
    next(err)
  }
}

async function getUserVoiceSamples(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const samples = await model.voiceSamples.getByUserId(userId)
    res.status(200).send(samples)
  } catch (err) {
    next(err)
  }
}

async function resolveUserSampleAudio(sampleId, userId) {
  const sample = await verifyUserSampleOwnership(sampleId, userId)
  if (!sample.audioFilePath) {
    throw new UserVoiceSampleNotFound("Audio file not found")
  }
  const filePath = resolveStoragePath(sample.audioFilePath)
  if (!filePath) {
    throw new UserVoiceSampleNotFound("Audio file not found")
  }
  return filePath
}

async function getUserVoiceSampleAudio(req, res, next) {
  try {
    const filePath = await resolveUserSampleAudio(
      req.params.id, req.payload.data.userId,
    )
    res.sendFile(filePath)
  } catch (err) {
    next(err)
  }
}

async function deleteUserVoiceSample(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const sampleId = req.params.id

    const sample = await verifyUserSampleOwnership(sampleId, userId)

    deleteSampleFile(sample)

    const deleteResult = await model.voiceSamples.delete(sampleId)
    if (deleteResult.deletedCount !== 1) {
      throw new UserVoiceSampleError(
        "Error during the deletion of the voice sample",
      )
    }

    res.status(200).send("Voice sample deleted")
  } catch (err) {
    next(err)
  }
}

async function deleteAllUserVoiceSamples(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const samples = await model.voiceSamples.getByUserId(userId)
    cascadeDeleteSampleFiles(samples)
    await Promise.all([
      model.voiceSamples.deleteAllFromUser(userId),
      model.voiceOptIns.deleteAllFromUser(userId),
    ])

    res.status(200).send("All voice samples deleted")
  } catch (err) {
    next(err)
  }
}

// Stub: validates the storage mode preference but does not persist yet.
// Persistence will be added when the user settings model supports storageMode.
async function updateStorageMode(req, res, next) {
  try {
    const { storageMode } = req.body

    if (!storageMode || !Object.values(STORAGE_MODE).includes(storageMode)) {
      throw new UserVoiceSampleError("Invalid storage mode. Must be 'audio' or 'embeddings'")
    }

    res.status(501).send({
      message: "Storage mode preference is not yet persisted. This endpoint will be functional in a future release.",
      storageMode,
      warning: storageMode === STORAGE_MODE.EMBEDDINGS
        ? "Audio files will be deleted after voiceprint calculation. This is irreversible."
        : null,
    })
  } catch (err) {
    next(err)
  }
}

async function getUserVoiceOrganizations(req, res, next) {
  try {
    const userId = req.payload.data.userId

    const [userOrgs, optIns] = await Promise.all([
      model.organizations.listSelf(userId),
      model.voiceOptIns.getByUserId(userId),
    ])

    const optInOrgIds = new Set(
      optIns.map((o) => o.organizationId.toString()),
    )

    const result = userOrgs.map((org) => ({
      organizationId: org._id.toString(),
      organizationName: org.name,
      voiceprintEnabled: optInOrgIds.has(org._id.toString()),
    }))

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

async function updateVoiceOrganization(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const { orgId } = req.params
    const { enabled } = req.body

    if (typeof enabled !== "boolean") {
      throw new UserVoiceSampleError("enabled must be a boolean")
    }

    // Verify the user is a member of this organization
    const orgs = await model.organizations.getById(orgId)
    if (orgs.length === 0) {
      throw new UserVoiceSampleNotFound("Organization not found")
    }
    const isMember = (orgs[0].users || []).some((u) => u.userId === userId)
    if (!isMember) {
      throw new UserVoiceSampleNotFound("You are not a member of this organization")
    }

    if (enabled) {
      await model.voiceOptIns.setOptIn(userId, orgId)
    } else {
      await model.voiceOptIns.removeOptIn(userId, orgId)
    }

    res.status(200).send({ organizationId: orgId, voiceprintEnabled: enabled })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createUserVoiceSample,
  getUserVoiceSamples,
  getUserVoiceSampleAudio,
  deleteUserVoiceSample,
  deleteAllUserVoiceSamples,
  resolveUserSampleAudio,
  updateStorageMode,
  getUserVoiceOrganizations,
  updateVoiceOrganization,
}
