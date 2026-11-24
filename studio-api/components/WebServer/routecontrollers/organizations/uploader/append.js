const model = require(`${process.cwd()}/lib/mongodb/models`)
const PART_STATES = require(`${process.cwd()}/lib/dao/conversation/partStates`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)

const { newPart } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/partial`,
)
const { joinParts } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/partialAudio`,
)
const { dispatchUpload, recordUpload, validateConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
)
const { deleteFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { fetchJob } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)
const { injectSpeakerIdentification } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/offline.js`,
)

const {
  ConversationNoFileUploaded,
  ConversationMetadataRequire,
  ConversationError,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

// Returns the duration of the stored audio
async function dispatchPart(req, part) {
  const { organizationId, conversationId } = req.params
  const conversation = await validateConversation(conversationId, [
    "organization",
    "metadata",
  ])
  const transcription = conversation.metadata.transcription
  const speakerIdHeaders = await injectSpeakerIdentification(conversation)

  const { processingJob, file_data, seconds } = await dispatchUpload({
    files: req.files,
    endpoint: transcription.endpoint,
    transcriptionConfig: transcription.transcriptionConfig,
    // The next parts are placed after this duration
    requireDuration: true,
    headers: speakerIdHeaders,
    organizationId,
    userId: req.payload.data.userId,
  })
  try {
    const dispatched = throwIfError(
      await model.conversations.updatePart(
        conversationId,
        part.id,
        PART_STATES.UPLOADING,
        {
          job_id: processingJob.jobid,
          filepath: file_data.filePath,
          duration: seconds,
          state: PART_STATES.PENDING,
        },
      ),
    )
    if (dispatched.matchedCount !== 1) {
      throw new ConversationError("The append took too long and was dropped")
    }
    return seconds
  } catch (err) {
    deleteFile(file_data.storageFilePath)
    throw err
  }
}

async function appendPart(req) {
  if (!req.files?.file) throw new ConversationNoFileUploaded()
  if (Array.isArray(req.files.file)) {
    throw new ConversationMetadataRequire("A single file is expected")
  }
  const { organizationId, conversationId } = req.params

  // Queued before any processing: the arrival order is the order of the
  // audio and of the transcription
  const part = newPart()
  const queued = throwIfError(
    await model.conversations.addPart(conversationId, organizationId, part),
  )
  if (queued.matchedCount !== 1) {
    throw new ConversationError("Conversation is not open to append")
  }

  let duration
  try {
    duration = await dispatchPart(req, part)
  } catch (err) {
    await model.conversations.removePart(conversationId, part.id)
    throw err
  }

  // Joined now unless a previous append is still being stored
  await joinParts(
    await validateConversation(conversationId, ["jobs", "metadata"]),
  )

  await recordUpload({
    organizationId,
    userId: req.payload.data.userId,
    seconds: duration,
    ref: { conversationId },
  })
}

async function completeConversation(organizationId, conversationId) {
  const conversation = await validateConversation(conversationId, [
    "organization",
    "jobs",
  ])
  if (
    conversation.organization.organizationId !== organizationId ||
    !conversation.jobs?.transcription?.parts
  ) {
    throw new ConversationError("Conversation is not a partial conversation")
  }

  const result = throwIfError(
    await model.conversations.update({
      _id: conversationId,
      "jobs.transcription.partial": false,
    }),
  )
  if (result.matchedCount !== 1) throw new ConversationError()

  // Closes it right away when every part is already merged
  await fetchJob(conversationId, conversation.jobs)
}

async function appendReq(req, res, next) {
  try {
    const { organizationId, conversationId } = req.params
    const complete = String(req.body.complete) === "true"
    const hasUpload = req.files && Object.keys(req.files).length !== 0

    // Only a request that just completes goes without audio
    if (hasUpload || !complete) {
      await appendPart(req)
    }

    let message
    // Closed after its own audio is in: a refused audio leaves it open
    if (complete) {
      await completeConversation(organizationId, conversationId)
      message = "The conversation is closed once its last audio is processed"
    } else {
      message = "The audio is being processed and will follow the previous ones"
    }

    res.status(200).send({ message, conversationId })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  appendReq,
}
