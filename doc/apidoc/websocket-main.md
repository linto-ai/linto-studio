# LinTO Studio API - WebSocket Main Events

This document describes the main WebSocket events in the studio-api service: live sessions, transcriptions, organization monitoring, and conversation processing.

See also: [WebSocket LLM Events](./websocket-llm.md)

## Architecture Overview

```
┌─────────────────┐     WebSocket      ┌──────────────────────────────────────────┐
│                 │◄──────────────────►│              studio-api                  │
│     Client      │                    │  ┌────────────┐      ┌──────────────┐   │
│   (Browser)     │                    │  │ IoHandler  │◄────►│ BrokerClient │   │
│                 │                    │  │ (Socket.IO)│      │   (MQTT)     │   │
└─────────────────┘                    │  └────────────┘      └──────┬───────┘   │
                                       └───────────────────────────────┼──────────┘
                                                                       │
                                                        MQTT           │
                                       ┌───────────────────────────────┼──────────┐
                                       │                               ▼          │
                                       │  ┌─────────────┐      ┌─────────────┐   │
                                       │  │ Transcriber │─────►│ MQTT Broker │   │
                                       │  └─────────────┘      └─────────────┘   │
                                       │                                          │
                                       │  ┌─────────────┐             ▲           │
                                       │  │ Session API │─────────────┘           │
                                       │  └─────────────┘                         │
                                       └──────────────────────────────────────────┘
```

### Components

| Component        | Role                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------- |
| **IoHandler**    | Socket.IO server handling client connections, room management, and event broadcasting  |
| **BrokerClient** | MQTT client receiving transcriptions and session status updates from external services |

---

## Connection

### Authentication

All WebSocket connections require a valid JWT token passed via handshake auth or query parameter.

```javascript
const socket = io("https://studio-api.example.com", {
  auth: {
    token: "your-jwt-token",
  },
})
```

For public sessions with password protection:

```javascript
const socket = io("https://studio-api.example.com", {
  auth: {
    publicToken: "session-public-token",
  },
})
```

### Connection Lifecycle

On connection, the server checks broker status and emits `broker_ko` if the MQTT broker is not ready.

---

## Client Events (Client -> Server)

### Room Management

#### `join_room`

Join a session room to receive real-time transcription updates.

| Parameter | Type     | Description                                                                 |
| --------- | -------- | --------------------------------------------------------------------------- |
| `roomId`  | `string` | Concatenation of session ID and channel index: `{sessionId}/{channelIndex}` |

**Access Control:**

- Public sessions without password: allowed for all
- Public sessions with password: requires valid session token
- Private sessions: requires organization membership or ownership

**Example:**

```javascript
// Join room for session "abc123" channel 1
socket.emit("join_room", "abc123-session-id/1")
```

**Effect:**

- Client joins the Socket.IO room
- BrokerClient subscribes to MQTT topics for transcription delivery:
  - `transcriber/out/{sessionId}/{channelIndex}/partial`
  - `transcriber/out/{sessionId}/{channelIndex}/final`

---

#### `leave_room`

Leave a session room to stop receiving transcription updates.

| Parameter | Type     | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `roomId`  | `string` | Same format as join_room: `{sessionId}/{channelIndex}` |

**Example:**

```javascript
socket.emit("leave_room", "abc123-session-id/1")
```

**Effect:**

- Client leaves the Socket.IO room
- If no clients remain in the room, BrokerClient unsubscribes from MQTT topics

---

### Organization Monitoring

#### `watch_organization_session`

Subscribe to session updates for an organization. Receive notifications when sessions are created, updated, or deleted. This is the primary way to monitor if an organization has active live sessions.

| Parameter | Type     | Description     |
| --------- | -------- | --------------- |
| `orgaId`  | `string` | Organization ID |

**Access Control:** Requires organization membership.

**Example:**

```javascript
socket.emit("watch_organization_session", "org-123")
```

**Effect:**

- Client joins organization room
- Receives `orga_{orgaId}_session_update` events with live session status

**Use cases:**

- Display a "Live" indicator when sessions are active in the organization
- Show real-time session list with streaming status
- Monitor channel activity (streaming, paused, stopped)

---

#### `unwatch_organization_session`

Stop watching organization session updates.

| Parameter | Type     | Description     |
| --------- | -------- | --------------- |
| `orgaId`  | `string` | Organization ID |

**Example:**

```javascript
socket.emit("unwatch_organization_session", "org-123")
```

---

#### `watch_organization_media`

Subscribe to media processing updates (transcription jobs) for an organization. This allows monitoring offline file uploads as they are being transcribed, including completion percentage.

| Parameter | Type     | Description     |
| --------- | -------- | --------------- |
| `orgaId`  | `string` | Organization ID |

**Access Control:** Requires organization membership.

**Example:**

```javascript
socket.emit("watch_organization_media", "org-123")
```

**Effect:**

- Client joins organization media room
- Immediately receives `conversation_processing` with list of conversations being processed
- Starts polling loop for job status updates (every 10 seconds)

**Use cases:**

- Display progress bars for offline media uploads being transcribed
- Show transcription completion percentage in real-time
- Notify users when transcription jobs complete or fail

---

#### `unwatch_organization_media`

Stop watching organization media processing updates.

| Parameter | Type     | Description     |
| --------- | -------- | --------------- |
| `orgaId`  | `string` | Organization ID |

**Example:**

```javascript
socket.emit("unwatch_organization_media", "org-123")
```

**Effect:**

- Client leaves organization media room
- If no clients remain watching, stops the polling loop

---

## Server Events (Server -> Client)

### Connection Status

#### `unauthorized`

Sent when authentication fails or access is denied.

**Payload:** None

**Behavior:** Socket is disconnected immediately after this event.

---

#### `broker_ok`

Broadcast when MQTT broker connection is established.

**Payload:** None

---

#### `broker_ko`

Sent when MQTT broker connection is lost or unavailable.

**Payload:** None

---

### Live Transcription Events

These events are broadcast to clients in session rooms.

#### `partial`

Real-time partial transcription (words being spoken, may change).

**Room:** `{sessionId}/{channelIndex}` (same as join_room parameter)

**Payload:**

```json
{
  "text": "Hello world this is",
  "start": 1500,
  "end": 3200,
  "speaker": "speaker_1",
  "lang": "en-US"
}
```

---

#### `final`

Finalized transcription segment (will not change).

**Room:** `{sessionId}/{channelIndex}` (same as join_room parameter)

**Payload:**

```json
{
  "text": "Hello world, this is a test.",
  "start": 1500,
  "end": 4500,
  "speaker": "speaker_1",
  "lang": "en-US",
  "words": [
    { "word": "Hello", "start": 1500, "end": 1800 },
    { "word": "world", "start": 1850, "end": 2100 }
  ]
}
```

---

### Session Events

#### `orga_{orgaId}_session_update`

Broadcast when sessions in an organization change.

**Room:** `{orgaId}`

**Payload:**

```json
{
  "added": [
    { "id": "session-1", "name": "New Session", "channels": [...] }
  ],
  "removed": [
    { "id": "session-2", "name": "Ended Session" }
  ],
  "updated": [
    { "id": "session-3", "name": "Updated Session", "channels": [...] }
  ]
}
```

| Field     | Description                                                |
| --------- | ---------------------------------------------------------- |
| `added`   | New sessions created                                       |
| `removed` | Sessions ended or deleted                                  |
| `updated` | Sessions with modified properties (name, channels, status) |

---

### Conversation Events

#### `conversation_processing`

List of conversations currently being processed (transcription in progress).

**Room:** `{orgaId}` (for clients watching organization media)

**Payload:**

```json
[
  {
    "_id": "conv-123",
    "name": "Meeting Recording",
    "jobs": {
      "transcription": {
        "state": "processing",
        "progress": 45
      }
    }
  }
]
```

---

#### `conversation_processing_done`

Sent when conversation transcription completes successfully.

**Room:** `{orgaId}`

**Payload:** `string` - Conversation ID

```javascript
socket.on("conversation_processing_done", (convId) => {
  console.log(`Transcription complete for: ${convId}`)
})
```

---

#### `conversation_processing_error`

Sent when conversation transcription fails.

**Room:** `{orgaId}`

**Payload:** `string` - Conversation ID

---

#### `conversation_created`

Broadcast when a new conversation is created in the organization.

**Room:** `{orgaId}`

**Payload:**

```json
{
  "_id": "conv-123",
  "name": "New Conversation",
  "organization": "org-456",
  "jobs": { ... }
}
```

---

#### `conversation_deleted`

Broadcast when a conversation is deleted.

**Room:** `{orgaId}`

**Payload:**

```json
{
  "id": "conv-123",
  "status": "deleted"
}
```

---

## Internal Communication

### IoHandler <-> BrokerClient

The IoHandler and BrokerClient components communicate via Node.js EventEmitter.

#### Events from IoHandler to BrokerClient

| Event        | Parameters | Description                                |
| ------------ | ---------- | ------------------------------------------ |
| `join_room`  | `roomId`   | Subscribe to MQTT transcription topics     |
| `leave_room` | `roomId`   | Unsubscribe from MQTT transcription topics |

#### Events from BrokerClient to IoHandler

| Event                 | Parameters                | Description                     |
| --------------------- | ------------------------- | ------------------------------- |
| `partial`             | `roomId`, `transcription` | Partial transcription received  |
| `final`               | `roomId`, `transcription` | Final transcription received    |
| `watch_organization`  | `topic`, `sessions`       | Session status update from MQTT |
| `borker_disconnected` | -                         | MQTT broker connection lost     |

### BrokerClient MQTT Clients

The BrokerClient maintains three MQTT connections:

| Client                 | Topics                                                     | Purpose                                  |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| **deliveryClient**     | `transcriber/out/+/+/partial`, `transcriber/out/+/+/final` | Receive live transcriptions              |
| **sessionClient**      | `session/in/+/#`                                           | Session management                       |
| **organizationClient** | `system/out/sessions/statuses`                             | Organization-wide session status updates |

---

## Usage Examples

### Live Transcription

```javascript
const socket = io("https://studio-api.example.com", {
  auth: { token: jwtToken },
})

socket.on("connect", () => {
  // Join session room (sessionId/channelIndex)
  socket.emit("join_room", `${sessionId}/${channelIndex}`)
})

// Check broker status
socket.on("broker_ko", () => {
  console.warn("Transcription service unavailable")
})

socket.on("broker_ok", () => {
  console.log("Transcription service ready")
})

// Receive transcriptions
socket.on("partial", (transcription) => {
  // Update UI with partial text (may change)
  updateLiveText(transcription.text)
})

socket.on("final", (transcription) => {
  // Append finalized segment
  appendTranscript(transcription)
})

// Leave room when done
socket.emit("leave_room", `${sessionId}/${channelIndex}`)
```

### Organization Dashboard

```javascript
const socket = io("https://studio-api.example.com", {
  auth: { token: jwtToken },
})

// Watch all sessions in organization
socket.emit("watch_organization_session", organizationId)

// Watch media processing status
socket.emit("watch_organization_media", organizationId)

// Handle session updates
socket.on(`orga_${organizationId}_session_update`, (changes) => {
  changes.added.forEach((session) => addSessionToUI(session))
  changes.removed.forEach((session) => removeSessionFromUI(session))
  changes.updated.forEach((session) => updateSessionInUI(session))
})

// Handle conversation processing
socket.on("conversation_processing", (conversations) => {
  conversations.forEach((conv) => {
    updateProgressBar(conv._id, conv.jobs.transcription.progress)
  })
})

socket.on("conversation_processing_done", (convId) => {
  markAsComplete(convId)
})

socket.on("conversation_processing_error", (convId) => {
  markAsError(convId)
})

socket.on("conversation_created", (conversation) => {
  addConversationToList(conversation)
})
```

---

## Event Summary

### Client -> Server

| Event                          | Parameters                   | Description                          |
| ------------------------------ | ---------------------------- | ------------------------------------ |
| `join_room`                    | `{sessionId}/{channelIndex}` | Join session room for transcriptions |
| `leave_room`                   | `{sessionId}/{channelIndex}` | Leave session room                   |
| `watch_organization_session`   | `orgaId`                     | Watch organization sessions          |
| `unwatch_organization_session` | `orgaId`                     | Stop watching organization sessions  |
| `watch_organization_media`     | `orgaId`                     | Watch organization media processing  |
| `unwatch_organization_media`   | `orgaId`                     | Stop watching organization media     |

### Server -> Client

| Event                           | Room                         | Description              |
| ------------------------------- | ---------------------------- | ------------------------ |
| `unauthorized`                  | -                            | Authentication failed    |
| `broker_ok`                     | broadcast                    | MQTT broker connected    |
| `broker_ko`                     | broadcast                    | MQTT broker disconnected |
| `partial`                       | `{sessionId}/{channelIndex}` | Partial transcription    |
| `final`                         | `{sessionId}/{channelIndex}` | Final transcription      |
| `orga_{orgaId}_session_update`  | `{orgaId}`                   | Session changes          |
| `conversation_processing`       | `{orgaId}`                   | Processing status list   |
| `conversation_processing_done`  | `{orgaId}`                   | Transcription complete   |
| `conversation_processing_error` | `{orgaId}`                   | Transcription failed     |
| `conversation_created`          | `{orgaId}`                   | New conversation         |
| `conversation_deleted`          | `{orgaId}`                   | Conversation deleted     |

---

## Source Files

| File                                                                   | Description                              |
| ---------------------------------------------------------------------- | ---------------------------------------- |
| `studio-api/components/IoHandler/index.js`                             | Main Socket.IO server and event handlers |
| `studio-api/components/IoHandler/controllers/SocketEvents.js`          | Internal event routing from BrokerClient |
| `studio-api/components/IoHandler/controllers/MqttEvents.js`            | MQTT connection status handling          |
| `studio-api/components/IoHandler/controllers/SessionHandling.js`       | Session diff and grouping logic          |
| `studio-api/components/IoHandler/controllers/ConversationHandling.js`  | Conversation processing polling          |
| `studio-api/components/BrokerClient/index.js`                          | MQTT client initialization               |
| `studio-api/components/BrokerClient/controllers/MqttEventsDelivery.js` | MQTT message parsing and routing         |
