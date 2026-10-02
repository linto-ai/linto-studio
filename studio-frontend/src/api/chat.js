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
 * backend names it "New chat". Null on failure.
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
  return null
}

/**
 * List all chat discussions for a conversation (current user), newest
 * first. Null on failure.
 */
export async function apiListChatDiscussions(conversationId) {
  const req = await sendRequest(chatDiscussionsUrl(conversationId), {
    method: "get",
  })
  if (req.status === "success") return req.data
  return null
}

/**
 * Get a chat discussion with all messages. Null on failure.
 */
export async function apiGetChatDiscussion(conversationId, discussionId) {
  const req = await sendRequest(
    `${chatDiscussionsUrl(conversationId)}/${discussionId}`,
    { method: "get" },
  )
  if (req.status === "success") return req.data
  return null
}

/**
 * Update a chat discussion title; true on success
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
  return req.status === "success"
}

/**
 * Delete a chat discussion and all its messages; true on success
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
 * onError receives { status, data }: the HTTP status (null for an error
 * event inside the stream, 0 for a network failure) and the error body
 * (a SaaS refusal carries { code, reason, capability… }).
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
      onError({
        status: response.status,
        data: await readErrorBody(response),
      })
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
            else if (eventType === "error") onError({ status: null, data })
          } catch {
            /* ignore parse errors */
          }
        }
      }
    }
  } catch (err) {
    onError({ status: 0, data: { error: err.message || "Network error" } })
  }
}

// A JSON error body (studio-api errors, SaaS refusals) parsed, anything
// else wrapped as { error: text }
async function readErrorBody(response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return { error: text }
  }
}
