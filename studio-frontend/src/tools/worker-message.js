import EditorWorker from "../workers/collaboration-worker"
import { getImpersonatedOrgId } from "./getImpersonatedOrgId.js"

export function workerSendMessage(action, params) {
  EditorWorker.workerSingleton.sendMessage(action, params)
}

export function workerConnect(
  conversationId,
  userToken,
  userId,
  conversationFormat,
) {
  EditorWorker.workerSingleton.connect(
    conversationId,
    userToken,
    userId,
    conversationFormat,
    // during impersonation the websocket must request read-only admin access
    getImpersonatedOrgId() ? "backoffice-readonly" : null,
  )
}

export function workerDisconnect() {
  workerSendMessage("disconnect")
}

export function workerListener() {
  EditorWorker.workerSingleton.getWorker().onmessage = (event) => {}
}
