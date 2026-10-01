import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"
import { getCookie } from "@/tools/getCookie"

const BASE_API = getEnv("VUE_APP_CONVO_API")

// Wire path: the backend still names chat discussions "sessions".
function chatDiscussionsUrl(conversationId) {
  return `${BASE_API}/conversations/${conversationId}/chat/sessions`
}

/**
 * Check if chat feature is enabled on the backend
 */
export async function apiGetChatStatus() {
  const req = await sendRequest(`${BASE_API}/chat/status`, { method: "get" })
  if (req.status === "success") return req.data
  return { enabled: false }
}

/**
 * Create a new chat discussion for a conversation; without a title the
 * backend names it "New chat"
 */
export async function apiCreateChatDiscussion(conversationId, { title } = {}) {
  const body = {}
  if (title) body.title = title

  const req = await sendRequest(
    chatDiscussionsUrl(conversationId),
    { method: "post" },
    body,
  )
  if (req.status === "success") return req.data
  throw new Error(req.message || "Failed to create chat discussion")
}

/**
 * List all chat discussions for a conversation (current user), newest first
 */
export async function apiListChatDiscussions(conversationId) {
  const req = await sendRequest(chatDiscussionsUrl(conversationId), {
    method: "get",
  })
  if (req.status === "success") return req.data
  return []
}

/**
 * Get a chat discussion with all messages
 */
export async function apiGetChatDiscussion(conversationId, discussionId) {
  const req = await sendRequest(
    `${chatDiscussionsUrl(conversationId)}/${discussionId}`,
    { method: "get" },
  )
  if (req.status === "success") return req.data
  throw new Error(req.message || "Failed to get chat discussion")
}

/**
 * Update a chat discussion title
 */
export async function apiUpdateChatDiscussionTitle(
  conversationId,
  discussionId,
  title,
) {
  const req = await sendRequest(
    `${chatDiscussionsUrl(conversationId)}/${discussionId}`,
    { method: "patch" },
    { title },
  )
  if (req.status === "success") return req.data
  throw new Error(req.message || "Failed to update chat discussion title")
}

/**
 * Delete a chat discussion and all its messages
 */
export async function apiDeleteChatDiscussion(conversationId, discussionId) {
  const req = await sendRequest(
    `${chatDiscussionsUrl(conversationId)}/${discussionId}`,
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
  discussionId,
  content,
  { onToken, onDone, onError },
) {
  const userToken = getCookie("authToken")
  const url = `${chatDiscussionsUrl(conversationId)}/${discussionId}/messages`

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
    // Survives chunk boundaries: an "event:" line may arrive in a different
    // read than its "data:" line
    let eventType = null

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop()

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
