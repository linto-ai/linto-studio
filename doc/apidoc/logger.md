# LinTO Logging System

## Winston Configuration

Winston is a flexible and extensible **logging library** for Node.js that supports multiple **transports**, output destinations such as console, files, or HTTP endpoints.

In LinTO, Winston is configured using a **JSON configuration file** (`winston.config.json`) located at:

```
config/logger/winston.config.json
```

This configuration allows full customization of **log format, levels, and outputs** without changing code.
You can find more information about winston there : [winston guide](https://github.com/winstonjs/winston)

---

### Example Configuration File

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
        "format": "plain"
      }
    }
  ]
}
```

---

### Configuration Fields

#### **`format`**

Specifies the **global format** for all log outputs.

| Value     | Description                                                      | Example                                                                                                                                    |
| --------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `"json"`  | Structured JSON format. Best for machine processing and storage. | `{ "level": "info", "message": "Organization broker connection established", "source": "system", "timestamp": "2025-10-21T08:36:40.704Z"}` |
| `"plain"` | Human-readable plain text format (used when colorized).          | `2025-10-21T08:35:24.439Z [info]: Organization broker connection established {"source":"system"}`                                          |

Each transport can override this with its own `options.format` field.

---

#### **`transports`**

An array defining where and how logs are written.
Each transport object must specify:

- **`type`** → the transport kind (`console`, `file`, or `http`)
- **`options`** → configuration specific to that type

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

#### **File Transport (error/warn/debug logs)**

Persists logs to disk. Multiple transports configuration file can be handle.

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
| `format`   | `string`  | Optional override (`json` or `plain`). If set, overrides global format. |

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

| Level   | Purpose                | Example                                           |
| ------- | ---------------------- | ------------------------------------------------- |
| `error` | Critical failures      | Server errors                                     |
| `warn`  | Studio error           | Error generated error and handled by the platform |
| `info`  | Standard runtime info  | Service started, client connected, api called     |
| `debug` | Verbose developer logs | Detailed HTTP events or payloads                  |

Each transport writes only logs at or **above its level** (e.g., a `warn` transport won’t log `info` messages but will logs `error` messages).

---

### Changing Configuration

To customize Winston’s behavior:

1. Open `config/logger/winston.config.json`.
2. Edit or add transports as needed.
3. Restart the service for the changes to take effect.

Example, to add a new log file:

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

## Log Overview

The LinTO logging system provides a **structured and contextualized** way to record events from different components (webserver, socket.io, system).
It ensures that each log entry contains enough metadata to be **machine-readable**, **human-friendly**, and **ready for storage or filtering** in databases or log management tools.

The system is composed of three main layers:

1. **Context Builder** : shapes structured log data.
2. **Logger** : dispatches logs to configured winston transports (console, file, HTTP).
3. **LogManager** : orchestrates the creation and dispatch of logs, and optionally persists important logs.

---

## Log Structure

Each log entry is a **JSON object** following a standardized schema.
Fields may vary slightly depending on the source (`webserver`, `socketio`, etc.), but the base format remains consistent.

### Example (Socket.io event)

```json
{
  "level": "info",
  "message": "New client connected : ocfbWDBvXWDU2s4BAAAB",
  "scope": "resource",
  "socket": {
    "connected": true,
    "disconnected": false,
    "id": "ocfbWDBvXWDU2s4BAAAB",
    "namespace": "/",
    "rooms": ["ocfbWDBvXWDU2s4BAAAB"]
  },
  "source": "socketio",
  "timestamp": "2025-10-20T15:24:01.677Z"
}
```

### Example (System broker connection)

```json
{
  "level": "info",
  "message": "Organization broker connection established",
  "source": "system",
  "timestamp": "2025-10-21T13:05:35.928Z"
}
```

### Example (Webserver action log)

```json
{
  "http": {
    "method": "GET",
    "status": 200,
    "url": "/api/organizations/688778cb980f721744a206d8/conversations"
  },
  "level": "info",
  "organization": {
    "id": "688778cb980f721744a206d8",
    "info": { "name": "linagora" },
    "role": { "name": "ADMIN", "value": 6 }
  },
  "scope": "resource",
  "source": "webserver",
  "timestamp": "2025-10-21T13:08:25.736Z",
  "user": {
    "id": "688778cb980f721744a206d7",
    "info": {
      "email": "user@linagora.com",
      "firstname": "user",
      "lastname": "lng"
    },
    "role": { "name": "SUPER_ADMINISTRATOR", "value": 31 }
  }
}
```

---

## Field Reference

| Field            | Type                | Description                                                                                   |
| ---------------- | ------------------- | --------------------------------------------------------------------------------------------- |
| **level**        | `string`            | Logging level, e.g. `debug`, `info`, `warn`, or `error`.                                      |
| **message**      | `string`            | Short human-readable description of the event. May be omitted for state logs.                 |
| **timestamp**    | `string (ISO-8601)` | UTC timestamp of when the log was emitted.                                                    |
| **source**       | `string`            | The logical origin of the event (`webserver`, `socketio`, `system`).                          |
| **scope**        | `string`            | The high-level category of action: `"platform"`, `"organization"`, `"user"`, or `"resource"`. |
| **socket**       | `object`            | Metadata for socket.io-related events (if applicable).                                        |
| **user**         | `object`            | Metadata about the authenticated user performing the action (only for webserver).             |
| **organization** | `object`            | Metadata about the organization context                                                       |
| **http**         | `object`            | HTTP-specific data such as method, URL, and response status.                                  |
| **error**        | `object`            | Optional error information (`name`, `stack`) when an exception occurs.                        |
