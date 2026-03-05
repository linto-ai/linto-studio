import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"
import { getCookie } from "@/tools/getCookie"

const BASE_API = getEnv("VUE_APP_CONVO_API")

/**
 * Check if chat feature is enabled on the backend
 */
export async function apiGetChatStatus() {
  const req = await sendRequest(`${BASE_API}/chat/status`, { method: "get" })
  if (req.status === "success") return req.data
  return { enabled: false }
}

/**
 * Create a new chat session for a conversation
 */
export async function apiCreateChatSession(conversationId, flavorId = null) {
  const body = {}
  if (flavorId) body.flavorId = flavorId

  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/chat/sessions`,
    { method: "post" },
    body,
  )
  if (req.status === "success") return req.data
  throw new Error(req.message || "Failed to create chat session")
}

/**
 * List all chat sessions for a conversation (current user)
 */
export async function apiListChatSessions(conversationId) {
  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/chat/sessions`,
    { method: "get" },
  )
  if (req.status === "success") return req.data
  return []
}

/**
 * Get a chat session with all messages
 */
export async function apiGetChatSession(conversationId, sessionId) {
  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/chat/sessions/${sessionId}`,
    { method: "get" },
  )
  if (req.status === "success") return req.data
  throw new Error(req.message || "Failed to get chat session")
}

/**
 * Update a chat session title
 */
export async function apiUpdateChatSessionTitle(
  conversationId,
  sessionId,
  title,
) {
  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/chat/sessions/${sessionId}`,
    { method: "patch" },
    { title },
  )
  if (req.status === "success") return req.data
  throw new Error(req.message || "Failed to update chat session title")
}

/**
 * Delete a chat session and all its messages
 */
export async function apiDeleteChatSession(conversationId, sessionId) {
  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/chat/sessions/${sessionId}`,
    { method: "delete" },
  )
  return req.status === "success"
}

/**
 * Send a chat message with SSE streaming.
 * Uses native fetch (not axios) for streaming support.
 */
export async function apiSendChatMessage(
  conversationId,
  sessionId,
  content,
  { onToken, onDone, onError },
) {
  const userToken = getCookie("authToken")
  const url = `${BASE_API}/conversations/${conversationId}/chat/sessions/${sessionId}/messages`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      const err = await response.text()
      onError(err)
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop()

      let eventType = null
      for (const line of lines) {
        if (line.startsWith("event: ")) {
          eventType = line.slice(7).trim()
        } else if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6))
            if (eventType === "token") onToken(data.content)
            else if (eventType === "done") onDone(data)
            else if (eventType === "error") onError(data.error)
          } catch (e) {
            /* ignore parse errors */
          }
        }
      }
    }
  } catch (err) {
    onError(err.message || "Network error")
  }
}
