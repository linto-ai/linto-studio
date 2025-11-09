#!/usr/bin/env node

/**
 * LinTO MCP Server - HTTP/SSE Version
 *
 * This server exposes LinTO transcription capabilities via HTTP using
 * the Model Context Protocol over Server-Sent Events (SSE).
 *
 * Each user connects with their own LinTO API token via Authorization header.
 * The server acts as a proxy, creating LinTO clients with the user's token.
 *
 * Environment Variables:
 *   PORT - HTTP server port (default: 3000)
 *   LINTO_BASE_URL - LinTO Studio API base URL (optional, default: https://studio.linto.ai/cm-api)
 *   LOG_LEVEL - Logging level (default: info)
 *   UPLOAD_DIR - Temporary upload directory (default: /tmp/linto-uploads)
 */

import express from "express";
import cors from "cors";
import multer from "multer";
import winston from "winston";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import LinTO from "@linto-ai/linto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.PORT || 3000;
const LINTO_BASE_URL = process.env.LINTO_BASE_URL || "https://studio.linto.ai/cm-api";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/linto-uploads";

// Setup Winston logger
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let msg = `${timestamp} [${level}] ${message}`;
          if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
          }
          return msg;
        })
      ),
    }),
  ],
});

// Setup Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      cb(null, UPLOAD_DIR);
    } catch (error) {
      logger.error("Failed to create upload directory", { error: error.message });
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/wave",
      "audio/m4a",
      "audio/x-m4a",
      "audio/flac",
      "audio/ogg",
      "video/mp4",
    ];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|m4a|flac|ogg|mp4)$/i)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allowedMimes.join(", ")}`));
    }
  },
});

// Extract LinTO token from Authorization header
function extractLintoToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header. Please provide: Authorization: Bearer <your-linto-token>");
  }
  return authHeader.substring(7);
}

// Create LinTO client with user's token
function createLintoClient(userToken) {
  return new LinTO({
    authToken: userToken,
    baseUrl: LINTO_BASE_URL,
  });
}

// Cleanup temporary file
async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
    logger.debug("Cleaned up temporary file", { filePath });
  } catch (error) {
    logger.warn("Failed to cleanup temporary file", { filePath, error: error.message });
  }
}

// Create MCP server instance with user's LinTO client
function createMCPServer(lintoClient, userToken) {
  const server = new Server(
    {
      name: "linto-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.debug("Listing available tools");
    return {
      tools: [
        {
          name: "transcribe_audio",
          description:
            "Transcribe an audio file to text using LinTO Studio. Accepts audio data as base64 encoded string. Supports speaker diarization, multiple languages, and automatic punctuation. Returns the full transcription with metadata including speakers, timestamps, and language detection.",
          inputSchema: {
            type: "object",
            properties: {
              audio_data: {
                type: "string",
                description: "Base64 encoded audio file data",
              },
              filename: {
                type: "string",
                description: "Original filename (for mime type detection)",
              },
              enable_diarization: {
                type: "boolean",
                description: "Enable speaker diarization (identify different speakers)",
                default: true,
              },
              number_of_speakers: {
                type: "number",
                description: "Number of speakers (0 for auto-detection)",
                default: 0,
              },
              language: {
                type: "string",
                description:
                  "2-letter language code (e.g., 'en', 'fr') or '*' for auto-detection and multiple languages",
                default: "*",
              },
              enable_punctuation: {
                type: "boolean",
                description: "Enable automatic punctuation recognition",
                default: true,
              },
              name: {
                type: "string",
                description: "Name for the media in LinTO Studio",
              },
            },
            required: ["audio_data", "filename"],
          },
        },
        {
          name: "list_services",
          description:
            "List all available ASR (Automatic Speech Recognition) services in LinTO Studio. Shows available transcription models and their configurations.",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "transcribe_with_format",
          description:
            "Transcribe an audio file and return the result in a specific formatted output. Accepts audio data as base64 encoded string. This combines transcription with custom formatting options for the output text.",
          inputSchema: {
            type: "object",
            properties: {
              audio_data: {
                type: "string",
                description: "Base64 encoded audio file data",
              },
              filename: {
                type: "string",
                description: "Original filename (for mime type detection)",
              },
              enable_diarization: {
                type: "boolean",
                description: "Enable speaker diarization (identify different speakers)",
                default: true,
              },
              number_of_speakers: {
                type: "number",
                description: "Number of speakers (0 for auto-detection)",
                default: 0,
              },
              language: {
                type: "string",
                description:
                  "2-letter language code (e.g., 'en', 'fr') or '*' for auto-detection",
                default: "*",
              },
              enable_punctuation: {
                type: "boolean",
                description: "Enable automatic punctuation recognition",
                default: true,
              },
              include_speaker: {
                type: "boolean",
                description: "Include speaker information in formatted output",
                default: true,
              },
              include_language: {
                type: "boolean",
                description: "Include language information in formatted output",
                default: true,
              },
              include_timestamp: {
                type: "boolean",
                description: "Include timestamps in formatted output",
                default: true,
              },
              separator: {
                type: "string",
                description: "Separator between metadata fields",
                default: " - ",
              },
              line_ending: {
                type: "string",
                description: "Line ending style: CRLF, LF, or none",
                default: "CRLF",
              },
            },
            required: ["audio_data", "filename"],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    logger.info("Tool call received", { requestId, tool: name });

    try {
      if (name === "list_services") {
        logger.debug("Listing LinTO services", { requestId });
        const services = await lintoClient.listServices();
        logger.info("Services listed successfully", { requestId, count: services.length });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(services, null, 2),
            },
          ],
        };
      }

      if (name === "transcribe_audio" || name === "transcribe_with_format") {
        const {
          audio_data,
          filename,
          enable_diarization = true,
          number_of_speakers = 0,
          language = "*",
          enable_punctuation = true,
          name: mediaName,
          include_speaker = true,
          include_language = true,
          include_timestamp = true,
          separator = " - ",
          line_ending = "CRLF",
        } = args;

        // Validate input
        if (!audio_data || !filename) {
          throw new Error("audio_data and filename are required");
        }

        // Decode base64 audio data and save to temporary file
        const tempFilePath = path.join(UPLOAD_DIR, `${requestId}-${filename}`);
        logger.debug("Saving audio to temporary file", { requestId, tempFilePath });

        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        const audioBuffer = Buffer.from(audio_data, "base64");
        await fs.writeFile(tempFilePath, audioBuffer);

        logger.info("Audio file received", {
          requestId,
          filename,
          size: audioBuffer.length,
          diarization: enable_diarization,
          speakers: number_of_speakers,
          language,
        });

        try {
          // Open file as blob
          const file = await fs.openAsBlob(tempFilePath);

          logger.debug("Starting transcription", { requestId });
          const handle = await lintoClient.transcribe(file, {
            enableDiarization: enable_diarization,
            numberOfSpeaker: number_of_speakers.toString(),
            language,
            enablePunctuation: enable_punctuation,
            name: mediaName || filename,
          });

          // Wait for transcription to complete
          const result = await new Promise((resolve, reject) => {
            handle.addEventListener("done", (e) => {
              logger.info("Transcription completed", { requestId });
              resolve(e.detail);
            });

            handle.addEventListener("error", (e) => {
              logger.error("Transcription failed", { requestId, error: e.detail });
              reject(new Error(`Transcription failed: ${JSON.stringify(e.detail)}`));
            });
          });

          // Cleanup temporary file
          await cleanupFile(tempFilePath);

          // Return formatted or raw result
          if (name === "transcribe_with_format") {
            const formattedText = result.toFormat({
              sep: separator,
              eol: line_ending,
              include: {
                speaker: include_speaker,
                lang: include_language,
                timestamp: include_timestamp,
              },
            });

            return {
              content: [
                {
                  type: "text",
                  text: formattedText,
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      full_text: result.fullText,
                      turns: result.turns,
                      metadata: {
                        conversation_id: result.response?.conversationId,
                        status: result.response?.status,
                      },
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }
        } catch (error) {
          // Cleanup on error
          await cleanupFile(tempFilePath);
          throw error;
        }
      }

      throw new Error(`Unknown tool: ${name}`);
    } catch (error) {
      logger.error("Tool call failed", { requestId, tool: name, error: error.message, stack: error.stack });
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

// Health check endpoint
app.get("/health", (req, res) => {
  logger.debug("Health check requested");
  res.json({
    status: "ok",
    service: "linto-mcp-server",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// SSE endpoint for MCP protocol
app.get("/sse", async (req, res) => {
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const userToken = extractLintoToken(req);
    const lintoClient = createLintoClient(userToken);

    logger.info("MCP client connected via SSE", { sessionId });

    const mcpServer = createMCPServer(lintoClient, userToken);
    const transport = new SSEServerTransport("/messages", res);

    await mcpServer.connect(transport);

    // Handle client disconnect
    req.on("close", () => {
      logger.info("MCP client disconnected", { sessionId });
    });
  } catch (error) {
    logger.error("SSE connection failed", { sessionId, error: error.message });
    res.status(401).json({ error: error.message });
  }
});

// POST endpoint for MCP messages
app.post("/messages", async (req, res) => {
  try {
    extractLintoToken(req);
    // This endpoint is handled by the SSE transport
    // The transport will process the message and send response via SSE
    res.status(202).json({ accepted: true });
  } catch (error) {
    logger.error("Message post failed", { error: error.message });
    res.status(401).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack });
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info("LinTO MCP Server started", {
    port: PORT,
    lintoBaseUrl: LINTO_BASE_URL,
    logLevel: LOG_LEVEL,
    uploadDir: UPLOAD_DIR,
  });
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  LinTO MCP Server (HTTP/SSE)                   ║
╠════════════════════════════════════════════════════════════════╣
║  Status:       Running                                         ║
║  Port:         ${PORT.toString().padEnd(50)}║
║  Health:       http://localhost:${PORT}/health${' '.repeat(29 - PORT.toString().length)}║
║  MCP Endpoint: http://localhost:${PORT}/sse${' '.repeat(32 - PORT.toString().length)}║
╠════════════════════════════════════════════════════════════════╣
║  Users must provide their LinTO API token via header:          ║
║  Authorization: Bearer <your-linto-token>                      ║
╚════════════════════════════════════════════════════════════════╝
  `);
});
