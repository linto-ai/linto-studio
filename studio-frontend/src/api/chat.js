import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"
import { getCookie } from "@/tools/getCookie"

const BASE_API = getEnv("VUE_APP_CONVO_API")

// Wire path: the backend still names chat discussions "sessions".
function chatDiscussionsUrl(scope) {
  if (scope.kind === "session") {
    return `${BASE_API}/organizations/${scope.organizationId}/sessions/${scope.sessionId}/chat/sessions`
  }
  return `${BASE_API}/conversations/${scope.conversationId}/chat/sessions`
}

/**
 * Chat and catchup availability; null when the check itself failed
 * (network/API error), so callers can retry instead of caching "disabled"
 */
export async function apiGetChatStatus() {
  const req = await sendRequest(`${BASE_API}/chat/status`, { method: "get" })
  if (req?.status === "success") return req.data
  return null
}

/**
 * Create a new chat discussion
 */
export async function apiCreateChatDiscussion(scope, { title } = {}) {
  const body = {}
  if (title) body.title = title
  // Only live-session discussions are pinned to a channel; the conversation
  // backend has no such field.
  if (scope.kind === "session" && scope.channelId != null) {
    body.channelId = scope.channelId
  }

  const req = await sendRequest(
    chatDiscussionsUrl(scope),
    { method: "post" },
    body,
  )
  if (req.status === "success") return req.data
  throw new Error(req.message || "Failed to create chat discussion")
}

/**
 * List all chat discussions in a scope (current user)
 */
export async function apiListChatDiscussions(scope) {
  const req = await sendRequest(chatDiscussionsUrl(scope), { method: "get" })
  if (req.status === "success") return req.data
  return []
}

/**
 * Get a chat discussion with all messages
 */
export async function apiGetChatDiscussion(scope, discussionId) {
  const req = await sendRequest(`${chatDiscussionsUrl(scope)}/${discussionId}`, {
    method: "get",
  })
  if (req.status === "success") return req.data
  throw new Error(req.message || "Failed to get chat discussion")
}

/**
 * Update a chat discussion title
 */
export async function apiUpdateChatDiscussionTitle(scope, discussionId, title) {
  const req = await sendRequest(
    `${chatDiscussionsUrl(scope)}/${discussionId}`,
    { method: "patch" },
    { title },
  )
  if (req.status === "success") return req.data
  throw new Error(req.message || "Failed to update chat discussion title")
}

/**
 * Delete a chat discussion and all its messages
 */
export async function apiDeleteChatDiscussion(scope, discussionId) {
  const req = await sendRequest(`${chatDiscussionsUrl(scope)}/${discussionId}`, {
    method: "delete",
  })
  return req.status === "success"
}

/**
 * Send a chat message with SSE streaming.
 * Uses native fetch (not axios) for streaming support.
 * requestArgs carries the extra wire fields ({ mode, lang }): the session
 * backend uses them for server-built prompts (catchup), the conversation
 * backend ignores them.
 */
export async function apiSendChatMessage(
  scope,
  discussionId,
  prompt,
  requestArgs,
  { onToken, onDone, onError },
) {
  const { mode, lang } = requestArgs ?? {}
  const userToken = getCookie("authToken")
  const url = `${chatDiscussionsUrl(scope)}/${discussionId}/messages`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ content: prompt, mode, lang }),
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
