const debug = require("debug")(
  "linto:components:IoHandler:Conversations-Handling",
)

const MAX_ATTEMPTS = 1000

const { fetchJob } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)

function watchConversation(io, conversations, attempts = 0, delay = 10000) {
  let timeoutId = null

  async function loop(convs, attempt) {
    try {
      let activeConversations = []
      for (const conversation of convs) {
        const result = await fetchJob(
          conversation._id.toString(),
          conversation.jobs,
        )

        if (result?.conv_job?.transcription?.state === "done") {
          io.emit(`conversation_processing_done`, result.conv_id)
        } else if (result?.conv_job?.transcription?.state === "error") {
          io.emit(`conversation_processing_error`, result.conv_id)
        } else {
          let conv = { ...conversation, jobs: result?.conv_job }
          activeConversations.push(conv)
        }
      }

      if (activeConversations.length === 0) {
        return
      }
      if (attempt >= MAX_ATTEMPTS) {
        return
      }

      io.emit("conversation_processing", activeConversations)
      timeoutId = setTimeout(
        () => loop(activeConversations, attempt + 1),
        delay,
      )
    } catch (err) {
      debug("Error while fetching conversation jobs", err)
      return
    }
  }

  // Start the processing loop of fetching the conversations status
  loop(conversations, attempts)

  return {
    getId: () => timeoutId,
    stop: () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    },
  }
}

// Called when a new conversation is added to refresh the interval
function refreshInterval(io, watcher, conversations) {
  if (watcher && typeof watcher.stop === "function") {
    watcher.stop()
  }
  return watchConversation(io, conversations)
}

module.exports = { watchConversation, refreshInterval }
