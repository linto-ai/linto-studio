import Debug from "debug"
import { apiSubscribeLlmJob, apiUnsubscribeLlmJob, apiCheckOrganizationAccess } from "../request/index.js"

const debug = Debug("Websocket:debug:llmJobController")

// Track active subscriptions per socket
const socketSubscriptions = new Map()

/**
 * Subscribe to LLM job updates for an organization/conversation
 * Client -> Server: llm:join
 * @param {object} data - { organizationId, conversationId }
 * @param {object} io - Socket.io server instance
 */
async function subscribeToJob(data, io) {
  const socket = this
  const { organizationId, conversationId } = data

  if (!organizationId) {
    socket.emit("llm:job:error", {
      error: "Missing organizationId",
    })
    return
  }

  // Security: Verify user has access to this organization
  const userToken = socket.handshake?.query?.userToken
  if (!userToken) {
    debug(`[LLM] Unauthorized llm:join attempt - no userToken`)
    socket.emit("llm:job:error", {
      error: "Unauthorized - missing authentication",
    })
    return
  }

  try {
    const orgAccess = await apiCheckOrganizationAccess(organizationId, userToken)
    if (orgAccess.status !== "success") {
      debug(`[LLM] User denied access to org ${organizationId}`)
      socket.emit("llm:job:error", {
        error: "Unauthorized - no access to this organization",
      })
      return
    }
  } catch (err) {
    debug(`[LLM] Auth check failed for llm:join: ${err.message}`)
    socket.emit("llm:job:error", {
      error: "Authorization check failed",
    })
    return
  }

  debug(`Subscribing to LLM updates for org ${organizationId}${conversationId ? `, conv ${conversationId}` : ""}`)

  // Join the organization room
  const orgRoom = `llm/${organizationId}`
  socket.join(orgRoom)

  // Track subscription
  if (!socketSubscriptions.has(socket.id)) {
    socketSubscriptions.set(socket.id, new Set())
  }
  socketSubscriptions.get(socket.id).add(orgRoom)

  // If conversationId provided, also join conversation-specific room
  if (conversationId) {
    const convRoom = `llm/${organizationId}/${conversationId}`
    socket.join(convRoom)
    socketSubscriptions.get(socket.id).add(convRoom)
  }

  debug(`Socket ${socket.id} joined LLM rooms for org ${organizationId}`)
}

/**
 * Unsubscribe from LLM job updates
 * Client -> Server: llm:leave
 * @param {object} data - { organizationId, conversationId }
 */
function unsubscribeFromJob(data) {
  const socket = this
  const { organizationId, conversationId } = data

  if (!organizationId) {
    return
  }

  debug(`Unsubscribing from LLM updates for org ${organizationId}`)

  const orgRoom = `llm/${organizationId}`
  socket.leave(orgRoom)

  // Remove from tracking
  if (socketSubscriptions.has(socket.id)) {
    socketSubscriptions.get(socket.id).delete(orgRoom)
  }

  // Also leave conversation-specific room if provided
  if (conversationId) {
    const convRoom = `llm/${organizationId}/${conversationId}`
    socket.leave(convRoom)
    if (socketSubscriptions.has(socket.id)) {
      socketSubscriptions.get(socket.id).delete(convRoom)
    }
  }
}

/**
 * Broadcast LLM job update to all subscribers
 * Server -> Client: llm:job:update, llm:job:complete, llm:job:error
 * @param {object} io - Socket.io server instance
 * @param {object} update - { organizationId, conversationId?, jobId, status, progress, result, error, format }
 * Note: conversationId is optional - will broadcast to org room only if missing
 */
function broadcastJobUpdate(io, update) {
  const { organizationId, conversationId, jobId, status } = update

  if (!organizationId || !jobId) {
    debug(`[LLM] Cannot broadcast: missing organizationId (${organizationId}) or jobId (${jobId})`)
    return
  }

  // Broadcast to organization room and conversation room if available
  const orgRoom = `llm/${organizationId}`
  const convRoom = conversationId ? `llm/${organizationId}/${conversationId}` : null

  debug(`[LLM] Broadcasting job ${jobId} (status: ${status}) to room ${orgRoom}${convRoom ? ` and ${convRoom}` : ""}`)

  // Determine which event to emit based on status
  let eventName = "llm:job:update"
  if (status === "completed" || status === "complete") {
    eventName = "llm:job:complete"
  } else if (status === "error" || status === "failed") {
    eventName = "llm:job:error"
  }

  // Broadcast to organization room
  io.to(orgRoom).emit(eventName, update)

  // Also broadcast to conversation-specific room if available
  if (convRoom) {
    io.to(convRoom).emit(eventName, update)
  }
}

/**
 * Clean up subscriptions when socket disconnects
 * @param {string} socketId - Socket ID
 */
function cleanupSubscriptions(socketId) {
  if (socketSubscriptions.has(socketId)) {
    socketSubscriptions.delete(socketId)
  }
}

export default {
  subscribeToJob,
  unsubscribeFromJob,
  broadcastJobUpdate,
  cleanupSubscriptions,
}
