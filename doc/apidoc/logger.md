# LinTO Logging System

## Winston Configuration

Winston is a flexible logging library for Node.js that supports multiple **transports** (output destinations such as console, files, or HTTP endpoints).

### Configuration File Location

```
studio-api/config/logger/winston.config.json
```

You can override this path using the `WINSTON_CONFIG_PATH` environment variable.

For more information about Winston: [winston guide](https://github.com/winstonjs/winston)

---

### Example Configuration

```json
{
  "format": "json",
  "transports": [
    {
      "type": "console",
      "options": {
        "level": "info",
        "colorize": true
      }
    },
    {
      "type": "file",
      "options": {
        "level": "error",
        "filename": "./logs/errors.log",
        "maxsize": 10485760,
        "maxFiles": 5,
        "tailable": true
      }
    },
    {
      "type": "file",
      "options": {
        "level": "warn",
        "filename": "./logs/warning.log",
        "maxsize": 10485760,
        "maxFiles": 5,
        "tailable": true
      }
    },
    {
      "type": "file",
      "options": {
        "level": "debug",
        "filename": "./logs/debug.json",
        "format": "json"
      }
    }
  ]
}
```

---

### Global Options

#### **`format`**

Default format for all transports. Can be overridden per transport.

| Value    | Output Style                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------- |
| `"json"` | `{"level":"info","message":"Broker connected","source":"system","timestamp":"2025-10-21T08:36:40Z"}`  |
| (other)  | `2025-10-21T08:35:24Z [info]: Broker connected {"source":"system"}`                                   |

#### **`level`**

Default log level for all transports (default: `"info"`). Can be overridden per transport.

---

#### **`transports`**

An array defining where and how logs are written.
Each transport object must specify:

- **`type`** - the transport kind (`console`, `file`, or `http`)
- **`options`** - configuration specific to that type

---

### Supported Transports

#### **Console Transport**

Used for local debugging or development environments.

```json
{
  "type": "console",
  "options": {
    "level": "info",
    "colorize": true
  }
}
```

| Option     | Type      | Description                                                          |
| ---------- | --------- | -------------------------------------------------------------------- |
| `level`    | `string`  | Minimum log level displayed (`error`, `warn`, `info`, `debug`, etc.) |
| `colorize` | `boolean` | Adds color coding to log levels for readability in terminal.         |

---

#### **File Transport**

Persists logs to disk. You can configure multiple file transports for different log levels.

```json
{
  "type": "file",
  "options": {
    "level": "error",
    "filename": "./logs/errors.log",
    "maxsize": 10485760,
    "maxFiles": 5,
    "tailable": true
  }
}
```

| Option     | Type      | Description                                                             |
| ---------- | --------- | ----------------------------------------------------------------------- |
| `level`    | `string`  | Minimum level to include (e.g., `error` for only critical logs).        |
| `filename` | `string`  | Destination path for log file.                                          |
| `maxsize`  | `number`  | Maximum size (in bytes) before the file is rotated.                     |
| `maxFiles` | `number`  | Maximum number of rotated files to keep.                                |
| `tailable` | `boolean` | Keeps old logs in a rotating manner (useful for continuous writes).     |
| `format`   | `string`  | Set to `"json"` to override global format for this transport.           |

---

#### **HTTP Transport (optional)**

Used for remote log streaming to an external monitoring service.

```json
{
  "type": "http",
  "options": {
    "level": "info",
    "host": "logs.example.com",
    "path": "/logs",
    "port": 9000
  }
}
```

| Option  | Type     | Description                              |
| ------- | -------- | ---------------------------------------- |
| `level` | `string` | Minimum level for sending logs.          |
| `host`  | `string` | Remote host for log aggregation.         |
| `port`  | `number` | Destination port for HTTP POST requests. |

---

### Default Log Level Hierarchy

| Level   | Purpose               | Example                                      |
| ------- | --------------------- | -------------------------------------------- |
| `error` | Critical failures     | Server crashes, unhandled exceptions         |
| `warn`  | Handled errors        | API errors, validation failures              |
| `info`  | Standard runtime info | Service started, client connected, API calls |
| `debug` | Verbose logs          | Detailed request/response data               |

Each transport writes only logs at or **above its level** (e.g., a `warn` transport won't log `info` messages but will log `error` messages).

---

### Changing Configuration

To customize logging:

1. Edit `studio-api/config/logger/winston.config.json`
2. Restart the service

**Example:** Add an info-level log file:

```json
{
  "type": "file",
  "options": {
    "level": "info",
    "filename": "./logs/info.log",
    "maxFiles": 14,
    "format": "json"
  }
}
```

---

## Log Types

The LinTO logging system records events from different sources. Each log type captures specific information relevant to its context.

### Sources

| Source       | Description                                              |
| ------------ | -------------------------------------------------------- |
| `webserver`  | HTTP API requests and responses                          |
| `socketio`   | Real-time socket connections (users joining sessions)    |
| `mqtt`       | Channel streaming events (transcription start/stop)      |
| `system`     | Internal system events (startup, broker connections)     |

---

## Log Examples

### System Event

Service startup and internal connections.

```json
{
  "level": "info",
  "message": "Organization broker connection established",
  "source": "system",
  "timestamp": "2025-10-21T13:05:35.928Z"
}
```

---

### API Request

HTTP requests to the platform API.

```json
{
  "level": "info",
  "source": "webserver",
  "scope": "resource",
  "timestamp": "2025-10-21T13:08:25.736Z",
  "http": {
    "method": "GET",
    "url": "/api/organizations/688778cb980f721744a206d8/conversations",
    "status": 200
  },
  "user": {
    "id": "688778cb980f721744a206d7",
    "info": {
      "email": "user@linagora.com",
      "firstname": "user",
      "lastname": "lng"
    },
    "role": { "name": "SUPER_ADMINISTRATOR", "value": 31 }
  },
  "organization": {
    "id": "688778cb980f721744a206d8",
    "info": { "name": "linagora" },
    "role": { "name": "ADMIN", "value": 6 }
  }
}
```

---

### Socket Connection

User joining or leaving a live session.

```json
{
  "level": "info",
  "source": "socketio",
  "scope": "resource",
  "activity": "session",
  "timestamp": "2025-10-20T15:24:01.677Z",
  "message": "ocfbWDBvXWDU2s4BAAAB join abc123-session",
  "socket": {
    "id": "ocfbWDBvXWDU2s4BAAAB",
    "connectionCount": 1,
    "totalWatchTime": 0,
    "lastJoinedAt": "2025-10-20T15:24:01.677Z"
  },
  "session": {
    "sessionId": "abc123-session",
    "name": "Team Meeting",
    "organizationId": "688778cb980f721744a206d8",
    "visibility": "public"
  },
  "user": {
    "id": "688778cb980f721744a206d7",
    "info": { "email": "user@linagora.com" }
  }
}
```

---

### Channel Event

Transcription channel starting or stopping streaming.

```json
{
  "level": "info",
  "source": "mqtt",
  "scope": "resource",
  "activity": "channel",
  "action": "mount",
  "timestamp": "2025-10-21T14:30:00.000Z",
  "session": {
    "sessionId": "abc123-session",
    "name": "Team Meeting",
    "organizationId": "688778cb980f721744a206d8",
    "visibility": "public"
  },
  "channel": {
    "channelId": "1",
    "translations": ["fr", "en"],
    "type": "microsoft",
    "name": "Azure Speech Profile",
    "description": "Production transcriber",
    "languages": ["fr-FR", "en-US"],
    "region": "francecentral",
    "hasDiarization": true
  },
  "organization": {
    "id": "688778cb980f721744a206d8",
    "info": { "name": "linagora" }
  }
}
```

**Note:** Sensitive credentials (API keys) are automatically excluded from channel logs.

---

### LLM Event

AI/LLM operations (summaries, generation).

```json
{
  "level": "info",
  "source": "webserver",
  "scope": "resource",
  "activity": "llm",
  "timestamp": "2025-10-21T14:00:00.000Z",
  "llm": {
    "conversation": {
      "id": "conv123",
      "name": "Meeting Notes"
    },
    "query": "Generate summary",
    "jobId": "job-456",
    "contentLength": 15000
  },
  "user": { ... },
  "organization": { ... }
}
```

---

### Transcription Event

Transcription job processing.

```json
{
  "level": "info",
  "source": "webserver",
  "scope": "resource",
  "activity": "transcription",
  "timestamp": "2025-10-21T14:00:00.000Z",
  "transcription": {
    "conversationId": "conv123",
    "name": "Meeting Recording",
    "duration": 3600,
    "jobId": "job-789"
  },
  "user": { ... },
  "organization": { ... }
}
```

---

## Field Reference

| Field            | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| **level**        | Log severity: `error`, `warn`, `info`, or `debug`                                             |
| **message**      | Human-readable description of the event                                                       |
| **timestamp**    | UTC time when the event occurred (ISO-8601 format)                                            |
| **source**       | Origin of the event: `webserver`, `socketio`, `mqtt`, or `system`                             |
| **scope**        | Category: `platform`, `organization`, `user`, `resource`, `authenticate`, or `tokens`         |
| **activity**     | Type of activity: `session`, `channel`, `llm`, or `transcription`                             |
| **action**       | Specific action: `mount` (channel start) or `unmount` (channel stop)                          |
| **http**         | HTTP request details (method, URL, status code)                                               |
| **user**         | User who performed the action (id, email, name, role)                                         |
| **organization** | Organization context (id, name, user's role in org)                                           |
| **session**      | Live session details (sessionId, name, visibility)                                            |
| **channel**      | Channel configuration (channelId, translations, transcriber settings)                         |
| **socket**       | Socket connection info (id, connection count, watch time)                                     |
| **llm**          | LLM operation details (conversation, query, job info)                                         |
| **transcription**| Transcription job details (conversation, duration, job info)                                  |
| **error**        | Error information when something fails (name, stack trace)                                    |

---

## Activity Log Storage

Important events are stored in the database for KPI tracking and analytics. The following events are persisted:

| Event Type       | What's Stored                                                    |
| ---------------- | ---------------------------------------------------------------- |
| **API Requests** | Most POST/PUT/DELETE requests (modifications)                    |
| **Sessions**     | User join/leave events with watch time                           |
| **Channels**     | Channel mount/unmount events with duration                       |
| **LLM**          | All AI generation requests                                       |
| **Transcription**| All transcription jobs                                           |

### Not Stored

- GET requests (read-only operations)
- Login attempts
- System events (startup, connections)

---

## Querying Logs

### By File

Logs are written to files based on your Winston configuration:
- `logs/errors.log` - Critical errors only
- `logs/warning.log` - Warnings and errors
- `logs/debug.json` - All events (verbose)

### By Database

Activity logs stored in MongoDB can be queried for:
- User session analytics (watch time, connection counts)
- Channel streaming metrics (duration per channel)
- API usage statistics
- LLM and transcription job history
