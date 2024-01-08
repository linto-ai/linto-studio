import Debug from "debug"
import Conversations from "../models/conversations.js"
import { apiGenerateKeywords } from "../request/index.js"
import { v4 as uuidv4 } from "uuid"

const debug = Debug("Websocket:debug:hightLightController")

export default async function hightLightController(
  { conversationId, userToken, serviceScope, categoryName },
  io
) {
  let conversation = Conversations.getById(conversationId)

  if (!conversation) {
    this.emit("error")
  }

  highLightFetchJob(
    conversation,
    conversationId,
    userToken,
    io,
    this,
    serviceScope,
    categoryName
  )
}

async function highLightFetchJob(
  conversation,
  conversationId,
  userToken,
  io,
  socket,
  serviceScope,
  categoryName
) {
  try {
    const room = `conversation/${conversationId}`
    const job = conversation.jobs[categoryName]
    if (
      job.state &&
      job.state != "started" &&
      job.state != "pending" &&
      job.state != "not_started"
    ) {
      debug("Job done")
    } else {
      if (job.state == "not_started") {
        // TODO: generalize for all highlight types
        let res = await apiGenerateKeywords(conversationId, userToken)
        if (res.status == "error") {
          socket.emit("error")
        }
      }

      job.fetchJob(userToken)
      setTimeout(
        () =>
          highLightFetchJob(
            conversation,
            conversationId,
            userToken,
            io,
            socket,
            serviceScope,
            categoryName
          ),
        3000
      )
      io.to(room).emit("hightlight_update", {
        ...conversation.jobs[categoryName].toJSON(),
      })
    }
  } catch (error) {
    console.error(error)
    socket.emit("error")
  }
}
