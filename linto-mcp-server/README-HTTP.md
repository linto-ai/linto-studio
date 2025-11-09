# LinTO MCP Server - HTTP/SSE Version

A remote HTTP-based MCP (Model Context Protocol) server that provides AI assistants with access to LinTO Studio's speech-to-text and audio transcription capabilities.

## Overview

This is the **HTTP/SSE version** of the LinTO MCP Server, designed to be deployed as a remote service (e.g., at `mcp.linto.ai`). Unlike the local stdio version, this server:

- ✅ Runs as an HTTP service accessible remotely
- ✅ Uses Server-Sent Events (SSE) for MCP protocol
- ✅ Multi-tenant: Each user provides their own LinTO API token
- ✅ Accepts audio files as base64 encoded data
- ✅ Includes proper logging with Winston
- ✅ Ready for production deployment with Docker

## Architecture

```
┌─────────────┐                    ┌──────────────────┐                    ┌─────────────────┐
│   Claude    │  Authorization:    │  MCP Server      │  User's Token      │  LinTO Studio   │
│   Desktop   │  Bearer <token>    │  (mcp.linto.ai)  │  ────────────────> │  API            │
│             │ ─────────────────> │                  │                    │                 │
│             │  Audio (base64)    │  Proxy Layer     │                    │                 │
└─────────────┘                    └──────────────────┘                    └─────────────────┘
```

Each user brings their own LinTO API token. The server acts as a proxy, creating LinTO clients with the user's credentials.

## Features

- **Remote Access**: Deploy once, use from anywhere
- **Multi-tenant**: Each user uses their own LinTO quota
- **Audio Upload**: Accepts audio as base64 encoded data
- **Speaker Diarization**: Automatically identify different speakers
- **Multi-language Support**: Auto-detect or specify languages
- **Automatic Punctuation**: Add proper punctuation to transcriptions
- **Flexible Formatting**: Customize output with timestamps, speaker labels
- **Production Ready**: Includes logging, error handling, health checks

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Build and run with docker-compose
docker-compose up -d

# Check health
curl http://localhost:3000/health
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Start the HTTP server
npm run start:http

# Or directly
node server.js
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP server port | `3000` |
| `LINTO_BASE_URL` | LinTO Studio API URL | `https://studio.linto.ai/cm-api` |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | `info` |
| `UPLOAD_DIR` | Temporary upload directory | `/tmp/linto-uploads` |

### Client Configuration

Users connect with their LinTO API token via the Authorization header.

**Claude Desktop Configuration** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "linto": {
      "url": "https://mcp.linto.ai/sse",
      "headers": {
        "Authorization": "Bearer YOUR_LINTO_API_TOKEN"
      }
    }
  }
}
```

Get your LinTO API token from [LinTO Studio](https://studio.linto.ai) → Organization Settings → Generate API Token.

## Available Tools

### 1. `transcribe_audio`

Transcribe audio with full metadata.

**Parameters:**
- `audio_data` (required): Base64 encoded audio file
- `filename` (required): Original filename for mime type detection
- `enable_diarization` (default: true): Enable speaker identification
- `number_of_speakers` (default: 0): Number of speakers (0 = auto)
- `language` (default: "*"): Language code or '*' for auto-detect
- `enable_punctuation` (default: true): Enable automatic punctuation
- `name`: Custom name for the media in LinTO Studio

**Returns:**
```json
{
  "full_text": "Complete transcription...",
  "turns": [
    {
      "speaker": "spk1",
      "lang": "en",
      "text": "Hello world",
      "stime": 0,
      "etime": 2.5
    }
  ],
  "metadata": {
    "conversation_id": "...",
    "status": "done"
  }
}
```

### 2. `transcribe_with_format`

Transcribe and return formatted text.

**Additional Parameters:**
- `include_speaker` (default: true): Include speaker labels
- `include_language` (default: true): Include language tags
- `include_timestamp` (default: true): Include timestamps
- `separator` (default: " - "): Separator between fields
- `line_ending` (default: "CRLF"): Line ending style

**Returns:**
```
spk1 - en - 00:00:00 : Hello world
spk2 - en - 00:00:03 : How are you?
```

### 3. `list_services`

List available ASR services and models.

**Parameters:** None

**Returns:** List of available transcription services with configurations.

## API Endpoints

### Health Check
```bash
GET /health
```

Returns server status and version info.

### MCP SSE Endpoint
```bash
GET /sse
Authorization: Bearer <linto-api-token>
```

Establishes SSE connection for MCP protocol.

### Message Endpoint
```bash
POST /messages
Authorization: Bearer <linto-api-token>
```

Receives MCP messages (handled by SSE transport).

## Deployment

### Docker Deployment

1. **Build the image:**
```bash
docker build -t linto/mcp-server:latest .
```

2. **Run with docker-compose:**
```bash
docker-compose up -d
```

3. **Check logs:**
```bash
docker-compose logs -f
```

### Production Deployment (with reverse proxy)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name mcp.linto.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Important for SSE
        proxy_buffering off;
        proxy_read_timeout 86400;
    }
}
```

## Logging

The server uses Winston for structured logging:

```json
{
  "timestamp": "2025-01-09T10:30:00.000Z",
  "level": "info",
  "message": "Tool call received",
  "requestId": "1736421000-abc123",
  "tool": "transcribe_audio"
}
```

Set `LOG_LEVEL` environment variable to control verbosity:
- `error`: Only errors
- `warn`: Warnings and errors
- `info`: General information (default)
- `debug`: Detailed debugging info

## Supported Audio Formats

- MP3
- WAV
- M4A
- FLAC
- OGG
- MP4 (audio track)

Max file size: 500MB

## Security

- **Token Authentication**: Users provide their own LinTO API tokens
- **No Server Token**: The server doesn't store any LinTO credentials
- **Multi-tenant Isolation**: Each user's requests use their own credentials
- **CORS Enabled**: Configure as needed for your deployment
- **Non-root User**: Docker container runs as non-root user

## Troubleshooting

### "Missing or invalid Authorization header"

Make sure you're providing the LinTO API token:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/sse
```

### "File not found" errors

Audio files are transmitted as base64 encoded data, not file paths. Make sure clients encode audio properly.

### Connection issues

Check health endpoint:
```bash
curl http://localhost:3000/health
```

View logs:
```bash
docker-compose logs -f
```

## Differences from stdio Version

| Feature | stdio (index.js) | HTTP/SSE (server.js) |
|---------|------------------|----------------------|
| Transport | stdio | HTTP/SSE |
| Deployment | Local only | Remote server |
| Auth | Local env var | User-provided token |
| Audio input | File path | Base64 encoded |
| Multi-tenant | No | Yes |
| Logging | Console | Winston |

## Development

### Running tests

```bash
# Run stdio version tests
npm test

# Test HTTP server (manual)
curl http://localhost:3000/health
```

### Project Structure

```
linto-mcp-server/
├── index.js                # stdio version (local)
├── server.js              # HTTP/SSE version (remote)
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── README-HTTP.md         # This file
```

## License

AGPL-3.0-or-later

## Support

- GitHub Issues: https://github.com/linto-ai/linto-studio/issues
- Documentation: https://doc.linto.ai
- LinTO Studio: https://studio.linto.ai
