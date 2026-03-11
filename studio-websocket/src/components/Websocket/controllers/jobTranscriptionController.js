import Debug from "debug"

const debug = Debug("Websocket:debug:jobTranscriptionController")

function notifySiblings(io, conversation, conversationId, state) {
  const canonicalId = conversation.obj?.type?.from_canonical_id
  if (canonicalId) {
    io.to(`canonical/${canonicalId}`).emit("sibling_job_transcription_update", {
      conversationId,
      state,
    })
  }
}

export default async function jobTranscriptionController(
  conversation,
  conversationId,
  userToken,
  io,
) {
  const room = `conversation/${conversationId}`
  const job = conversation.jobs["transcription"]
  if (job.state && (job.state === "done" || job.state === "error")) {
    debug("Job done")
    notifySiblings(io, conversation, conversationId, job.state)
  } else {
    await job.fetchJob(userToken)
    setTimeout(
      () =>
        jobTranscriptionController(conversation, conversationId, userToken, io),
      3000,
    )
    const jobData = conversation.jobs["transcription"].toJSON()
    io.to(room).emit("job_transcription_update", jobData)
  }
}
