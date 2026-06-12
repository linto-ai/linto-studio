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
  SYNC_STATE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  UserVoiceSampleError,
  UserVoiceSampleNotFound,
  UserVoiceSampleUnsupportedMediaType,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerIdentification`,
)

const { OrganizationForbidden } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)
const { SPEAKER_TYPE } = require(
  `${process.cwd()}/lib/dao/speakerIdentification/naming`,
)
const limits = require(`${process.cwd()}/lib/dao/speakerIdentification/limits`)

const { verifyOrgMembership } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/optedInMembers`,
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

    const existingSamples = await model.voiceSamples.getByUserId(userId)
    if (existingSamples.length >= limits.maxSamplesPerLabel()) {
      throw new UserVoiceSampleError(
        `Maximum number of voice samples reached (${limits.maxSamplesPerLabel()})`,
      )
    }

    const payload = {
      type: VOICE_SAMPLE_TYPE.USER,
      userId,
    }
    const audioDuration = parseAudioDuration(req.body.audioDuration)
    if (audioDuration !== undefined) {
      const totalDuration = existingSamples.reduce(
        (sum, s) => sum + (s.audioDuration || 0),
        0,
      )
      if (totalDuration + audioDuration > limits.maxTotalDurationPerLabel()) {
        throw new UserVoiceSampleError(
          `Maximum total duration of voice samples reached (${limits.maxTotalDurationPerLabel()}s)`,
        )
      }
      payload.audioDuration = audioDuration
    }

    const created = await storeAndCreateSample(
      audioFile, payload, model.voiceSamples, UserVoiceSampleError,
    )

    // CONNECTOR_HOOK: recomputeUser(userId) — compute the voiceprint from the
    // user samples, then upsert the "user:{id}" point in the Organization
    // collection of every opted-in organization (next step).

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

    // CONNECTOR_HOOK: recomputeUser(userId) — if samples remain, recompute
    // the voiceprint; if none remain, the voiceprint is kept (one-way
    // semantics, cf. docs/speaker-identification 04 §6a).

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
      model.voiceprints.deleteAllFromUser(userId),
    ])

    // CONNECTOR_HOOK: deleteSpeaker("user:{userId}") in the Organization
    // collection of every organization the user had opted in (next step).

    res.status(200).send("All voice samples deleted")
  } catch (err) {
    next(err)
  }
}

async function updateStorageMode(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const { storageMode } = req.body

    if (!storageMode || !Object.values(STORAGE_MODE).includes(storageMode)) {
      throw new UserVoiceSampleError("Invalid storage mode. Must be 'audio' or 'embeddings'")
    }

    const voiceprint = await model.voiceprints.getBySubject(
      SPEAKER_TYPE.USER,
      userId,
    )
    const currentMode = model.voiceprints.getStorageMode(voiceprint)

    if (storageMode === currentMode) {
      return res.status(200).send({ storageMode: currentMode })
    }

    // One-way transition: audio -> embeddings only
    if (storageMode === STORAGE_MODE.AUDIO) {
      throw new UserVoiceSampleError(
        "Storage mode cannot be reverted from 'embeddings' to 'audio'",
      )
    }

    await model.voiceprints.upsert(SPEAKER_TYPE.USER, userId, { storageMode })

    // CONNECTOR_HOOK: recomputeUser(userId) — when the connector is
    // available, compute the voiceprint from the remaining audio samples
    // here before purging the files (next step).

    let audioFilesDeleted = false
    if (model.voiceprints.hasComputedVoiceprint(voiceprint)) {
      // The voiceprint already exists: audio files are no longer kept
      const samples = await model.voiceSamples.getByUserId(userId)
      cascadeDeleteSampleFiles(samples)
      await model.voiceSamples.deleteAllFromUser(userId)
      audioFilesDeleted = true
    }

    res.status(200).send({
      storageMode,
      audioFilesDeleted,
    })
  } catch (err) {
    next(err)
  }
}

async function getVoiceprintStatus(req, res, next) {
  try {
    const userId = req.payload.data.userId

    const [voiceprint, audioSamples] = await Promise.all([
      model.voiceprints.getBySubject(SPEAKER_TYPE.USER, userId),
      model.voiceSamples.getByUserId(userId),
    ])

    const hasVoiceprint = model.voiceprints.hasComputedVoiceprint(voiceprint)
    const storageMode = model.voiceprints.getStorageMode(voiceprint)

    // In embeddings-only mode the sample documents are deleted after
    // computation: counters come from the voiceprint traceability fields
    let audioSamplesCount = audioSamples.length
    let totalDuration = audioSamples.reduce(
      (sum, s) => sum + (s.audioDuration || 0),
      0,
    )
    if (audioSamples.length === 0 && hasVoiceprint) {
      audioSamplesCount = (voiceprint.sourceSampleIds || []).length
      totalDuration = voiceprint.sourceDuration || 0
    }

    res.status(200).send({
      hasVoiceprint,
      storageMode,
      audioSamplesCount,
      totalDuration,
      computedAt: voiceprint?.computedAt || null,
      modelId: voiceprint?.modelId || null,
      syncState: hasVoiceprint
        ? voiceprint?.syncState || SYNC_STATE.SYNCED
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

    // Only organizations with the speaker identification permission are
    // exposed for opt-in (cf. docs/speaker-identification 02 §5)
    const result = userOrgs
      .filter((org) =>
        PERMISSIONS.hasRightAccess(
          org.permissions,
          PERMISSIONS.SPEAKER_IDENTIFICATION,
        ),
      )
      .map((org) => ({
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

    const org = await verifyOrgMembership(orgId, userId)
    if (
      !PERMISSIONS.hasRightAccess(
        org.permissions,
        PERMISSIONS.SPEAKER_IDENTIFICATION,
      )
    ) {
      throw new OrganizationForbidden(
        "Organization does not have the speaker identification permission",
      )
    }

    if (enabled) {
      await model.voiceOptIns.setOptIn(userId, orgId)
      // CONNECTOR_HOOK: upsertSpeaker("user:{userId}") in the Organization
      // collection of this organization (next step).
    } else {
      await model.voiceOptIns.removeOptIn(userId, orgId)
      // CONNECTOR_HOOK: deleteSpeaker("user:{userId}") in the Organization
      // collection of this organization (next step).
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
  getVoiceprintStatus,
  getUserVoiceOrganizations,
  updateVoiceOrganization,
}
