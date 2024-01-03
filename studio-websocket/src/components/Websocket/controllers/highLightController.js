import Conversations from "../models/conversations.js"
import { v4 as uuidv4 } from "uuid"

export default async function hightLightController(
  { conversationId, userToken, serviceScope, categoryName },
  io
) {
  let conversation = Conversations.getById(data.conversationId)
  if (!conversation) {
    this.emit("error")
  }

  highLightFetchJob(
    conversation,
    conversationId,
    userToken,
    io,
    serviceScope,
    categoryName
  )
}

function highLightFetchJob(
  conversation,
  conversationId,
  userToken,
  io,
  serviceScope,
  categoryName
) {
  try {
    const room = `conversation/${conversationId}`
    const job = conversation.jobs["transcription"]
    if (job.state && job.state != "started" && job.state != "pending") {
      debug("Job done")
    } else {
      job.fetchJob(userToken)
      setTimeout(
        () =>
          updateConversationController(
            conversation,
            conversationId,
            userToken,
            io
          ),
        3000
      )
      io.to(room).emit("job_transcription_update", {
        ...conversation.jobs["transcription"].toJSON(),
      })
    }
  } catch (error) {
    this.emit("error")
  }
}
