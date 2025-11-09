# LinTO MCP Server

An MCP (Model Context Protocol) server that provides AI assistants with access to LinTO Studio's powerful speech-to-text and audio transcription capabilities.

## Overview

This MCP server wraps the [LinTO Studio SDK](../studio-sdk) to expose transcription and speech recognition services through the Model Context Protocol. It allows AI assistants like Claude to transcribe audio files, identify speakers, detect languages, and format transcription output.

## Deployment Modes

This server supports **two deployment modes**:

### 1. Local Mode (stdio) - `index.js`

**Best for:** Personal use, local development, single-user scenarios

- Runs locally on your machine
- Uses stdio transport (command-line based)
- Token stored in local config
- Access local file system directly
- Zero network latency

**Use this mode if:** You want to run the MCP server on your own computer with Claude Desktop.

📖 **Documentation:** This README (you're reading it)

### 2. Remote Mode (HTTP/SSE) - `server.js`

**Best for:** Production deployment, multi-user, remote access

- Runs as an HTTP service (e.g., at `mcp.linto.ai`)
- Uses Server-Sent Events (SSE) for MCP protocol
- Multi-tenant: each user provides their own token
- Audio transmitted as base64 encoded data
- Production-ready with logging, Docker, health checks

**Use this mode if:** You want to deploy a remote MCP server that multiple users can access.

📖 **Documentation:** See [README-HTTP.md](./README-HTTP.md) for full HTTP/SSE deployment guide

---

**The rest of this README covers the Local Mode (stdio)**. For Remote Mode, see [README-HTTP.md](./README-HTTP.md).

## Features

- **Audio Transcription**: Convert audio files to text with high accuracy
- **Speaker Diarization**: Automatically identify and separate different speakers
- **Multi-language Support**: Auto-detect languages or specify target language
- **Automatic Punctuation**: Add proper punctuation to transcriptions
- **Flexible Formatting**: Customize output format with timestamps, speaker labels, and more
- **Service Discovery**: List available ASR models and configurations

## Installation (Local Mode)

1. Install dependencies:

```bash
cd linto-mcp-server
npm install
```

2. Get your LinTO Studio authentication token:
   - Visit [LinTO Studio](https://studio.linto.ai)
   - Go to your organization settings
   - Generate an API authentication token

## Configuration (Local Mode)

### MCP Client Configuration

Add this server to your MCP client configuration (e.g., Claude Desktop):

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "linto": {
      "command": "node",
      "args": ["/path/to/linto-studio/linto-mcp-server/index.js"],
      "env": {
        "LINTO_AUTH_TOKEN": "your-auth-token-here"
      }
    }
  }
}
```

**For Remote Mode (HTTP/SSE):** See [claude_desktop_config_http.example.json](./claude_desktop_config_http.example.json) and [README-HTTP.md](./README-HTTP.md)

## Available Tools

### 1. `transcribe_audio`

Transcribe an audio file to text with speaker identification and timestamps.

**Parameters:**
- `file_path` (required): Absolute path to the audio file
- `enable_diarization` (optional, default: true): Enable speaker diarization
- `number_of_speakers` (optional, default: 0): Number of speakers (0 for auto-detection)
- `language` (optional, default: "*"): Language code ('en', 'fr', etc.) or '*' for auto-detection
- `enable_punctuation` (optional, default: true): Enable automatic punctuation
- `name` (optional): Name for the media in LinTO Studio

**Returns:**
- Full transcription text
- Turn-by-turn breakdown with speaker, language, timestamps
- Metadata including conversation ID and status

**Example:**
```javascript
{
  "file_path": "/path/to/audio.mp3",
  "enable_diarization": true,
  "number_of_speakers": 2,
  "language": "en",
  "enable_punctuation": true,
  "name": "Meeting Recording"
}
```

### 2. `transcribe_with_format`

Transcribe an audio file and return formatted output with customizable metadata.

**Parameters:**
- `file_path` (required): Absolute path to the audio file
- `enable_diarization` (optional, default: true): Enable speaker diarization
- `number_of_speakers` (optional, default: 0): Number of speakers
- `language` (optional, default: "*"): Language code or '*' for auto-detection
- `enable_punctuation` (optional, default: true): Enable automatic punctuation
- `include_speaker` (optional, default: true): Include speaker labels in output
- `include_language` (optional, default: true): Include language tags in output
- `include_timestamp` (optional, default: true): Include timestamps in output
- `separator` (optional, default: " - "): Separator between metadata fields
- `line_ending` (optional, default: "CRLF"): Line ending style (CRLF, LF, or none)

**Returns:**
- Formatted transcription text with selected metadata

**Example:**
```javascript
{
  "file_path": "/path/to/audio.mp3",
  "include_speaker": true,
  "include_timestamp": true,
  "include_language": false,
  "separator": " | "
}
```

### 3. `list_services`

List all available ASR (Automatic Speech Recognition) services and models.

**Parameters:** None

**Returns:**
- List of available transcription services with their configurations

## Usage Examples

### Basic Transcription

Ask your AI assistant:
```
Please transcribe the audio file at /home/user/meeting.mp3
```

### Advanced Transcription with Custom Settings

```
Transcribe /home/user/interview.mp3 with the following settings:
- 3 speakers
- French language
- Include timestamps and speaker labels
- Use " | " as separator
```

### List Available Services

```
What transcription services are available in LinTO Studio?
```

## Supported Audio Formats

LinTO Studio supports common audio formats including:
- MP3
- WAV
- M4A
- FLAC
- OGG
- And more

## Development

### Running in Development Mode

**Local Mode (stdio):**
```bash
npm start
```

**Remote Mode (HTTP/SSE):**
```bash
npm run start:http
# Server will start on http://localhost:3000
```

### Testing

Test the LinTO SDK integration:

```bash
export LINTO_AUTH_TOKEN="your-token"
export TEST_AUDIO_FILE="/path/to/audio.mp3"
node test.js
```

## Architecture

```
linto-mcp-server/
├── index.js                              # Local mode (stdio) MCP server
├── server.js                             # Remote mode (HTTP/SSE) MCP server
├── package.json                          # Node.js package configuration
├── README.md                             # This file (Local mode docs)
├── README-HTTP.md                        # Remote mode documentation
├── claude_desktop_config.example.json    # Local mode config example
├── claude_desktop_config_http.example.json # Remote mode config example
├── Dockerfile                            # Docker image for remote deployment
├── docker-compose.yml                    # Docker Compose configuration
├── .dockerignore                         # Docker build optimization
└── test.js                              # SDK integration test
```

### Dependencies

The server uses:
- `@modelcontextprotocol/sdk`: MCP protocol implementation (stdio & SSE transports)
- `@linto-ai/linto`: LinTO Studio SDK for transcription
- `express`: HTTP server framework (remote mode only)
- `cors`: CORS middleware (remote mode only)
- `winston`: Structured logging (remote mode only)
- `multer`: File upload handling (remote mode only)

## Troubleshooting

### "LINTO_AUTH_TOKEN environment variable is required"

Make sure you've set the `LINTO_AUTH_TOKEN` environment variable in your MCP client configuration.

### "File not found"

Ensure you're providing absolute paths to audio files, not relative paths.

### Transcription Errors

Check that:
1. Your auth token is valid and not expired
2. The audio file format is supported
3. You have sufficient credits/quota in your LinTO Studio account
4. The base URL is correct (if using a custom instance)

## Choosing the Right Mode

| Feature | Local Mode (stdio) | Remote Mode (HTTP/SSE) |
|---------|-------------------|------------------------|
| **File** | `index.js` | `server.js` |
| **Transport** | stdio | HTTP/SSE |
| **Use Case** | Personal, local use | Multi-user, production |
| **Deployment** | Local machine only | Remote server (mcp.linto.ai) |
| **Authentication** | Token in local config | Token via Authorization header |
| **Audio Input** | Local file path | Base64 encoded data |
| **Multi-tenant** | No | Yes (each user has own token) |
| **Logging** | Console | Winston (structured) |
| **Docker Support** | No | Yes (Dockerfile + compose) |
| **Health Checks** | No | Yes (`/health` endpoint) |
| **Best For** | Single user on own machine | Shared service, multiple users |

📖 **Full comparison:** See [README-HTTP.md](./README-HTTP.md) for detailed remote mode documentation

## Links

- [LinTO Studio](https://studio.linto.ai) - Web interface
- [LinTO Platform](https://linto.ai) - Main website
- [LinTO SDK Documentation](../studio-sdk/README.md)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Remote Mode Documentation](./README-HTTP.md) - HTTP/SSE deployment guide

## License

AGPL-3.0-or-later

## Support

For issues and questions:
- GitHub Issues: https://github.com/linto-ai/linto-studio/issues
- Documentation: https://doc.linto.ai
