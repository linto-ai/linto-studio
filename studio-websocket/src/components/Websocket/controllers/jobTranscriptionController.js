import Debug from "debug"

import { getJobs } from "../request/index.js"
import Conversations from "../models/conversations.js"

const jobsFetcher = {}

const debug = Debug("Websocket:debug:jobTranscriptionController")
const debugJob = Debug("Websocket:debug:jobTranscriptionController:jobFetcher")

export default async function jobTranscriptionController(
  conversation,
  conversationId,
  userToken,
  io
) {
  if (!jobsFetcher[conversationId]) {
    debug("No job fetched yet")
    jobsFetcher[conversationId] = true
    fetchJob(conversation, conversationId, userToken, io)
  }
}

async function fetchJob(conversation, conversationId, userToken, io) {
  const currentState = conversation.transcriptionJob?.state
  const room = `conversation/${conversationId}`

  debugJob("currentState", currentState)

  if (currentState == "started" || currentState == "pending") {
    await conversation.transcriptionJob.fetchJob(userToken)
    setTimeout(
      () => fetchJob(conversation, conversationId, userToken, io),
      3000
    )

    const state = conversation.transcriptionJob?.state
    const steps = conversation.transcriptionJob?.steps
    const logs = conversation.transcriptionJob?.logs

    io.to(room).emit("job_transcription_update", { state, steps })

    if (state && state != "started" && state != "pending") {
      debug("Job done")

      await Conversations.requestConversation(conversationId, userToken)
      io.to(room).emit("job_transcription_update", { state, steps, logs })
    }
  }
}
