const debug = require("debug")(
  "linto:components:IoHandler:controllers:ConversationHandling",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { fetchJob } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)

// `io` must be replica-local (io.local.to(orgaId))
function watchConversation(io, orgaId, delay = 10000) {
  let timeoutId = null
  let stopped = false
  // Previous tick's list, to catch transitions persisted by someone else
  let pendingIds = new Set()

  function emitIfTerminal(convId, state) {
    if (state === "done" || state === "error") {
      io.emit(`conversation_processing_${state}`, convId)
      return true
    }
    return false
  }

  // Notify the final state of conversations gone from the processing list.
  // Returns the ids to retry when their state could not be read.
  async function notifyDisappeared(convIds) {
    if (convIds.length === 0) return []

    const conversations = await model.conversations.getConvsListByIds(convIds, {
      _id: 1,
      jobs: 1,
    })
    if (!Array.isArray(conversations)) return convIds

    for (const conversation of conversations) {
      emitIfTerminal(
        conversation._id.toString(),
        conversation?.jobs?.transcription?.state,
      )
    }
    return []
  }

  async function loop() {
    try {
      const processing =
        await model.conversations.listProcessingConversations(orgaId)
      const processingList = Array.isArray(processing) ? processing : []

      const stillProcessing = []
      const seenIds = new Set()
      for (const conversation of processingList) {
        const convId = conversation._id.toString()
        seenIds.add(convId)

        const result = await fetchJob(convId, conversation.jobs)
        const state = result?.conv_job?.transcription?.state

        if (emitIfTerminal(convId, state)) {
          pendingIds.delete(convId)
        } else {
          stillProcessing.push({
            ...conversation,
            jobs: result?.conv_job ?? conversation.jobs,
          })
        }
      }

      const disappearedIds = [...pendingIds].filter((id) => !seenIds.has(id))
      const retryIds = await notifyDisappeared(disappearedIds)

      pendingIds = new Set(stillProcessing.map((c) => c._id.toString()))
      for (const convId of retryIds) {
        pendingIds.add(convId)
      }

      if (stillProcessing.length > 0) {
        io.emit("conversation_processing", stillProcessing)
      }
    } catch (err) {
      debug("Error while fetching conversation jobs", err)
    } finally {
      if (!stopped) {
        timeoutId = setTimeout(loop, delay)
      }
    }
  }

  loop()

  return {
    stop: () => {
      stopped = true
      if (timeoutId) clearTimeout(timeoutId)
    },
  }
}

module.exports = { watchConversation }
