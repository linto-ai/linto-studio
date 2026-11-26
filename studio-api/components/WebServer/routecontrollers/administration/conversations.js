const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:administration:conversations",
)
const logger = require(`${process.cwd()}/lib/logger/logger`)
const LogManager = require(`${process.cwd()}/lib/logger/manager`)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)
const { deleteConversationCascade } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

const BATCH_SIZE = 100

// Deletes a batch of the media whose retention is over, with their audio
async function deleteExpiredBatch(req) {
  const expired = throwIfError(
    await model.conversations.listExpired(BATCH_SIZE),
  )

  let deleted = 0
  for (const conversation of expired) {
    try {
      await deleteConversationCascade(conversation)
      deleted += 1
      LogManager.logRetentionEvent(req, conversation)
    } catch (err) {
      // Tried again at the next call
      logger.error(
        `Expired media ${conversation._id} not deleted: ${err.message}`,
      )
    }
  }
  return { deleted, failed: expired.length - deleted }
}

async function deleteExpiredConversations(req, res, next) {
  try {
    let deleted = 0
    let failed = 0
    let batch
    // A full batch means that more may be waiting
    do {
      batch = await deleteExpiredBatch(req)
      deleted += batch.deleted
      failed += batch.failed
    } while (batch.deleted === BATCH_SIZE)

    res.status(200).send({
      message: "Expired conversations have been deleted",
      deleted,
      failed,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { deleteExpiredConversations }
