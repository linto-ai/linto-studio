# LinTO Studio WebSocket - LLM Events

This document describes WebSocket events related to LLM (Large Language Model) job monitoring in the **studio-websocket** service.

> **Note:** LLM events use a separate WebSocket connection to `studio-websocket`, not `studio-api`. See [WebSocket Main Events](./websocket-main.md) for session and transcription events on `studio-api`.

## Overview

LLM WebSocket events allow clients to subscribe to real-time updates for AI-powered operations such as:

- Summary generation
- Content analysis
- Text generation
- Other LLM-based features

---

## Connection

### Service Endpoint

LLM events are handled by **studio-websocket**, which is a separate service from studio-api.

| Service | Purpose |
| ------- | ------- |
| `studio-api` | Sessions, live transcriptions, organization monitoring |
| `studio-websocket` | Conversation editing, collaboration, LLM job updates |

### Authentication

Connect to studio-websocket with a `userToken` in the query parameters:

```javascript
const socket = io("https://studio-websocket.example.com", {
  path: "/socket.io", // or custom path from WEBSERVER_WS_PATH env
  query: {
    userToken: "your-jwt-token",
    conversationId: "conv-123", // required for conversation context
  },
})
```

---

## Client Events (Client -> Server)

### `llm:join`

Subscribe to LLM job updates for an organization or a specific conversation.

| Parameter        | Type     | Required | Description                                                   |
| ---------------- | -------- | -------- | ------------------------------------------------------------- |
| `organizationId` | `string` | Yes      | Organization ID                                               |
| `conversationId` | `string` | No       | Conversation ID (optional, for conversation-specific updates) |

**Access Control:** Requires organization membership (verified via `userToken`).

**Example:**

```javascript
// Subscribe to all LLM jobs in an organization
socket.emit("llm:join", {
  organizationId: "org-123",
})

// Subscribe to LLM jobs for a specific conversation
socket.emit("llm:join", {
  organizationId: "org-123",
  conversationId: "conv-456",
})
```

**Effect:**

- Client joins `llm/{organizationId}` room
- If `conversationId` provided, also joins `llm/{organizationId}/{conversationId}` room
- Client will receive `llm:job:update`, `llm:job:complete`, and `llm:job:error` events

**Error handling:**

If authorization fails, the server emits `llm:job:error`:

```json
{
  "error": "Unauthorized - no access to this organization"
}
```

---

### `llm:leave`

Unsubscribe from LLM job updates.

| Parameter        | Type     | Required | Description     |
| ---------------- | -------- | -------- | --------------- |
| `organizationId` | `string` | Yes      | Organization ID |
| `conversationId` | `string` | No       | Conversation ID |

**Example:**

```javascript
// Unsubscribe from organization-level updates
socket.emit("llm:leave", {
  organizationId: "org-123",
})

// Unsubscribe from conversation-specific updates
socket.emit("llm:leave", {
  organizationId: "org-123",
  conversationId: "conv-456",
})
```

---

## Server Events (Server -> Client)

### `llm:job:update`

Broadcast when an LLM job is in progress.

**Rooms:** `llm/{organizationId}`, `llm/{organizationId}/{conversationId}`

**Payload:**

```json
{
  "organizationId": "org-123",
  "conversationId": "conv-456",
  "jobId": "job-789",
  "status": "processing",
  "progress": 50
}
```

| Field            | Type     | Description                           |
| ---------------- | -------- | ------------------------------------- |
| `organizationId` | `string` | Organization ID                       |
| `conversationId` | `string` | Conversation ID                       |
| `jobId`          | `string` | Unique job identifier                 |
| `status`         | `string` | Current status (`processing`)         |
| `progress`       | `number` | Progress percentage (0-100), optional |

---

### `llm:job:complete`

Broadcast when an LLM job completes successfully.

**Rooms:** `llm/{organizationId}`, `llm/{organizationId}/{conversationId}`

**Payload:**

```json
{
  "organizationId": "org-123",
  "conversationId": "conv-456",
  "jobId": "job-789",
  "status": "completed",
  "result": {
    "summary": "Meeting discussed Q4 goals...",
    "keywords": ["Q4", "goals", "budget"]
  }
}
```

| Field            | Type     | Description                     |
| ---------------- | -------- | ------------------------------- |
| `organizationId` | `string` | Organization ID                 |
| `conversationId` | `string` | Conversation ID                 |
| `jobId`          | `string` | Unique job identifier           |
| `status`         | `string` | Status (`completed`)            |
| `result`         | `object` | Job result (varies by job type) |

---

### `llm:job:error`

Broadcast when an LLM job fails or authorization is denied.

**Rooms:** `llm/{organizationId}`, `llm/{organizationId}/{conversationId}`

**Payload:**

```json
{
  "organizationId": "org-123",
  "conversationId": "conv-456",
  "jobId": "job-789",
  "status": "error",
  "error": {
    "message": "Rate limit exceeded",
    "code": "RATE_LIMIT"
  }
}
```

| Field            | Type     | Description                  |
| ---------------- | -------- | ---------------------------- |
| `organizationId` | `string` | Organization ID              |
| `conversationId` | `string` | Conversation ID              |
| `jobId`          | `string` | Unique job identifier        |
| `status`         | `string` | Status (`error` or `failed`) |
| `error`          | `object` | Error details                |
| `error.message`  | `string` | Human-readable error message |
| `error.code`     | `string` | Error code (optional)        |

---

## Usage Example

### Complete LLM Job Monitoring

```javascript
// Connect to studio-websocket (separate from studio-api)
const socket = io("https://studio-websocket.example.com", {
  query: {
    userToken: jwtToken,
    conversationId: conversationId,
  },
})

const organizationId = "org-123"

// Subscribe to LLM updates for a conversation
socket.emit("llm:join", {
  organizationId,
  conversationId,
})

// Handle job progress updates
socket.on("llm:job:update", (data) => {
  console.log(`Job ${data.jobId}: ${data.progress}%`)
  updateProgressBar(data.jobId, data.progress)
})

// Handle job completion
socket.on("llm:job:complete", (data) => {
  console.log("Job complete:", data.result)
  displayResult(data.result)
  hideProgressBar(data.jobId)
})

// Handle job errors
socket.on("llm:job:error", (data) => {
  console.error("Job failed:", data.error)
  showError(data.error.message || data.error)
  hideProgressBar(data.jobId)
})

// Unsubscribe when leaving the page
window.addEventListener("beforeunload", () => {
  socket.emit("llm:leave", {
    organizationId,
    conversationId,
  })
})
```

---

## Event Summary

### Client -> Server

| Event       | Parameters                          | Description                  |
| ----------- | ----------------------------------- | ---------------------------- |
| `llm:join`  | `{organizationId, conversationId?}` | Subscribe to LLM job updates |
| `llm:leave` | `{organizationId, conversationId?}` | Unsubscribe from LLM updates |

### Server -> Client

| Event              | Room                     | Description      |
| ------------------ | ------------------------ | ---------------- |
| `llm:job:update`   | `llm/{orgId}[/{convId}]` | LLM job progress |
| `llm:job:complete` | `llm/{orgId}[/{convId}]` | LLM job done     |
| `llm:job:error`    | `llm/{orgId}[/{convId}]` | LLM job failed   |

---

## Source Files

| File                                                                | Description                         |
| ------------------------------------------------------------------- | ----------------------------------- |
| `studio-websocket/src/components/Websocket/index.js`                | WebSocket server and event handlers |
| `studio-websocket/src/components/Websocket/controllers/llmJobController.js` | LLM subscription and broadcast logic |
