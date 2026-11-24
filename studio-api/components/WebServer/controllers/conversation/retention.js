const debug = require("debug")(
  "linto:components:WebServer:controllers:conversation:retention",
)
const logger = require(`${process.cwd()}/lib/logger/logger`)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)
const { deleteConversationCascade } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

const BATCH_SIZE = 100

let _timer = null
let _running = false

// Deletes a batch of the media whose retention is over, with their audio.
// Returns how many were deleted.
async function deleteExpired() {
  const expired = throwIfError(
    await model.conversations.listExpired(BATCH_SIZE),
  )

  let deleted = 0
  for (const conversation of expired) {
    try {
      await deleteConversationCascade(conversation)
      deleted += 1
      logger.info(
        `Media ${conversation._id} of organization ${conversation.organization?.organizationId} deleted: retention over since ${conversation.expiresAt}`,
      )
    } catch (err) {
      // Deleted meanwhile by another instance, or tried again at the next check
      debug(`Expired media ${conversation._id} not deleted: ${err.message}`)
    }
  }
  return deleted
}

async function tick() {
  if (_running) return
  _running = true
  try {
    // A full batch means that more may be waiting
    let deleted
    do {
      deleted = await deleteExpired()
    } while (deleted === BATCH_SIZE)
  } catch (err) {
    debug(`media retention check error: ${err.message}`)
  } finally {
    _running = false
  }
}

function start() {
  if (_timer) return
  const seconds =
    parseInt(process.env.MEDIA_RETENTION_CHECK_INTERVAL, 10) || 3600
  _timer = setInterval(tick, seconds * 1000)
  if (_timer.unref) _timer.unref()
  debug(`media retention checked every ${seconds}s`)
}

module.exports = { start, tick, deleteExpired }
