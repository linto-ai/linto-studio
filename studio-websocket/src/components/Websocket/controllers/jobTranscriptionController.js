import Debug from "debug"

import { getJobs } from "../request/index.js"
import Conversations from "../models/conversations.js"

const jobsFetcher = {}

const debug = Debug("Websocket:debug:jobTranscriptionController")

export default async function jobTranscriptionController(
  conversation,
  conversationId,
  userToken,
  io
) {
  const room = `conversation/${conversationId}`
  const job = conversation.jobs["transcription"]
  if (job.state && job.state != "started" && job.state != "pending") {
    debug("Job done")
  } else {
    job.fetchJob(userToken)
    setTimeout(
      () =>
        jobTranscriptionController(conversation, conversationId, userToken, io),
      3000
    )
    io.to(room).emit("job_transcription_update", {
      ...conversation.jobs["transcription"].toJSON(),
    })
  }
}
