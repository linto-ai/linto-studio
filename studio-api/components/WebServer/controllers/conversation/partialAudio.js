const logger = require(`${process.cwd()}/lib/logger/logger`)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const PART_STATES = require(`${process.cwd()}/lib/dao/conversation/partStates`)

const { addFileMetadataToConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
)
const {
  joinAudio,
  deleteFile,
  deleteAudioFileIfOrphaned,
  getStorageFolder,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

// False when the audio changed in the meantime: another call is joining
async function joinPart(conversation, part) {
  const previous = conversation.metadata.audio
  const audio = await joinAudio(
    [previous.filepath, part.filepath],
    previous.filename,
  )

  let joined
  try {
    await addFileMetadataToConversation(
      conversation,
      audio,
      conversation.metadata.transcription.endpoint,
    )
    joined = await model.conversations.joinPart(
      conversation._id.toString(),
      part.id,
      previous.filepath,
      conversation.metadata,
    )
  } catch (err) {
    deleteFile(audio.storageFilePath)
    throw err
  }
  if (joined.matchedCount !== 1) {
    deleteFile(audio.storageFilePath)
    return false
  }

  // The previous audio may be shared with a duplicate, a part file never is
  await deleteAudioFileIfOrphaned(previous.filepath)
  deleteFile(`${getStorageFolder()}/${part.filepath}`)
  delete part.filepath
  return true
}

// Joined in arrival order: stops at a part still uploading. A failure is
// retried on the next call.
async function joinParts(conversation) {
  try {
    for (const part of conversation.jobs.transcription.parts) {
      if (part.state === PART_STATES.UPLOADING) return
      if (part.filepath && !(await joinPart(conversation, part))) return
    }
  } catch (err) {
    logger.error(
      `Audio parts of conversation ${conversation._id} not joined: ${err?.stack || err}`,
    )
  }
}

module.exports = { joinParts }
