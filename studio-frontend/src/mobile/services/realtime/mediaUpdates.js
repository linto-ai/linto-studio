import ApiEventWebSocket from "@/services/websocket/ApiEventWebSocket.js"

// One socket.io connection for the mobile app. ApiEventWebSocket pushes
// media updates straight into the shared store, so the list stays live.
const socket = new ApiEventWebSocket()
let watchedOrganizationId = null

// The editor page drives the lock+save protocol on this same connection.
export const realtimeSocket = socket

export async function connectRealtime() {
  await socket.connect()
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
