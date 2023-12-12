import EditorWorker from "../workers/collaboration-worker"

export function workerSendMessage(action, params) {
  EditorWorker.worker.postMessage({
    action,
    params,
  })
}

export function workerConnect(
  conversationId,
  userToken,
  userId,
  conversationFormat,
) {
  EditorWorker.worker.postMessage({
    action: "connect",
    params: { conversationId, userToken, userId, conversationFormat },
  })
}

export function workerDisconnect() {
  EditorWorker.worker.postMessage({
    action: "disconnect",
    params: {},
  })
}

export function workerListener() {
  EditorWorker.worker.onmessage = (event) => {}
}
