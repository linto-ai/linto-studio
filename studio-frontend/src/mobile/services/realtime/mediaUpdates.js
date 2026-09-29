import ApiEventWebSocket, {
  WEBSOCKET_STATUS,
} from "@/services/websocket/ApiEventWebSocket.js"
import { waitUntil } from "@/mobile/tools/waitUntil.js"

const CONNECT_TIMEOUT_MS = 8000

// One socket.io connection for the mobile app. ApiEventWebSocket pushes
// media updates straight into the shared store, so the list stays live.
const socket = new ApiEventWebSocket()
let watchedOrganizationId = null
let pendingConnection = null

// The editor page drives the lock+save protocol on this same connection.
export const realtimeSocket = socket

// Resolves true when connected, false after CONNECT_TIMEOUT_MS. Never hangs:
// ApiEventWebSocket.connect() only settles on "connect", so a rejected
// handshake would otherwise keep every page on its loading state. Concurrent
// callers share one attempt; a socket already connecting is not reopened.
export function connectRealtime() {
  if (socket.state.isConnected) return Promise.resolve(true)
  if (!pendingConnection) {
    pendingConnection = waitForConnection().finally(() => {
      pendingConnection = null
    })
  }
  return pendingConnection
}

async function waitForConnection() {
  const idle = [WEBSOCKET_STATUS.IDLE, WEBSOCKET_STATUS.FAILED]
  if (idle.includes(socket.state.status)) socket.connect()
  const connected = await waitUntil(() => socket.state.isConnected, {
    timeoutMs: CONNECT_TIMEOUT_MS,
  })
  if (!connected) {
    console.warn("realtime connection not ready, status", socket.state.status)
  }
  return connected
}

export function watchOrganizationMedia(organizationId) {
  watchedOrganizationId = organizationId
  socket.subscribeMediaUpdate(organizationId)
}

export function stopWatchingMedia() {
  watchedOrganizationId = null
  socket.unSubscribeMediaUdate()
}

export function isRealtimeConnected() {
  return socket.state.isConnected
}

export function realtimeState() {
  return socket.state
}

export function rewatchAfterReconnect() {
  if (watchedOrganizationId) socket.subscribeMediaUpdate(watchedOrganizationId)
}
