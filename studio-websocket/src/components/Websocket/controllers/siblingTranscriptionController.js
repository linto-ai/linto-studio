import Debug from "debug"
import { apiGetJobs, apiGetConversationChildren } from "../request/index.js"

const debug = Debug("Websocket:debug:siblingTranscriptionController")

// Track active polling loops to prevent duplicates across sockets
const activePolls = new Set()

export default async function siblingTranscriptionController(
  canonicalId,
  currentConversationId,
  userToken,
  io,
  socket,
) {
  try {
    const children = await apiGetConversationChildren(canonicalId, userToken)
    const siblings = children.filter((c) => c._id !== currentConversationId)
    const processingSiblings = siblings.filter((c) => {
      const state = c.jobs?.transcription?.state
      return state && state !== "done" && state !== "error"
    })

    if (processingSiblings.length === 0) {
      debug("No processing siblings to poll")
      return
    }

    debug("Polling %d processing siblings", processingSiblings.length)
    for (const sibling of processingSiblings) {
      const pollKey = `${canonicalId}/${sibling._id}`
      if (activePolls.has(pollKey)) {
        debug("Polling already active for sibling %s, skipping", sibling._id)
        continue
      }
      activePolls.add(pollKey)
      pollSiblingJob(sibling._id, canonicalId, pollKey, userToken, io)
    }
  } catch (error) {
    debug("Error in siblingTranscriptionController: %O", error)
  }
}

async function pollSiblingJob(siblingId, canonicalId, pollKey, userToken, io) {
  try {
    const jobs = await apiGetJobs(siblingId, userToken)
    const state = jobs?.transcription?.state

    debug("Sibling %s transcription state: %s", siblingId, state)

    const canonicalRoom = `canonical/${canonicalId}`
    io.to(canonicalRoom).emit("sibling_job_transcription_update", {
      conversationId: siblingId,
      state: state || "pending",
    })

    if (state && (state === "done" || state === "error")) {
      debug("Sibling %s transcription finished: %s", siblingId, state)
      activePolls.delete(pollKey)
      return
    }

    // Check if anyone is still listening in the canonical room
    const room = io.sockets.adapter.rooms.get(canonicalRoom)
    if (!room || room.size === 0) {
      debug("No clients in canonical room, stopping poll for %s", siblingId)
      activePolls.delete(pollKey)
      return
    }

    setTimeout(
      () => pollSiblingJob(siblingId, canonicalId, pollKey, userToken, io),
      5000,
    )
  } catch (error) {
    debug("Error polling sibling %s: %O", siblingId, error)
    activePolls.delete(pollKey)
  }
}
