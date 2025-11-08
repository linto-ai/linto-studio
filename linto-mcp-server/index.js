#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import LinTO from "@linto-ai/linto";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize LinTO client
let lintoClient = null;

function getLintoClient() {
  if (!lintoClient) {
    const authToken = process.env.LINTO_AUTH_TOKEN;
    const baseUrl = process.env.LINTO_BASE_URL || "https://studio.linto.ai/cm-api";

    if (!authToken) {
      throw new Error(
        "LINTO_AUTH_TOKEN environment variable is required. Get your token from https://studio.linto.ai"
      );
    }

    lintoClient = new LinTO({ authToken, baseUrl });
  }
  return lintoClient;
}

// Create MCP server
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
  return {
    tools: [
      {
        name: "transcribe_audio",
        description:
          "Transcribe an audio file to text using LinTO Studio. Supports speaker diarization, multiple languages, and automatic punctuation. Returns the full transcription with metadata including speakers, timestamps, and language detection.",
        inputSchema: {
          type: "object",
          properties: {
            file_path: {
              type: "string",
              description: "Absolute path to the audio file to transcribe",
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
          required: ["file_path"],
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
          "Transcribe an audio file and return the result in a specific formatted output. This combines transcription with custom formatting options for the output text.",
        inputSchema: {
          type: "object",
          properties: {
            file_path: {
              type: "string",
              description: "Absolute path to the audio file to transcribe",
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
          required: ["file_path"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "list_services") {
      const client = getLintoClient();
      const services = await client.listServices();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(services, null, 2),
          },
        ],
      };
    }

    if (name === "transcribe_audio") {
      const {
        file_path,
        enable_diarization = true,
        number_of_speakers = 0,
        language = "*",
        enable_punctuation = true,
        name: fileName,
      } = args;

      // Validate file exists
      if (!fs.existsSync(file_path)) {
        throw new Error(`File not found: ${file_path}`);
      }

      const client = getLintoClient();
      const file = await fs.openAsBlob(file_path);

      const handle = await client.transcribe(file, {
        enableDiarization: enable_diarization,
        numberOfSpeaker: number_of_speakers.toString(),
        language,
        enablePunctuation: enable_punctuation,
        name: fileName,
      });

      // Wait for transcription to complete
      const result = await new Promise((resolve, reject) => {
        handle.addEventListener("done", (e) => {
          resolve(e.detail);
        });

        handle.addEventListener("error", (e) => {
          reject(new Error(`Transcription failed: ${JSON.stringify(e.detail)}`));
        });
      });

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

    if (name === "transcribe_with_format") {
      const {
        file_path,
        enable_diarization = true,
        number_of_speakers = 0,
        language = "*",
        enable_punctuation = true,
        include_speaker = true,
        include_language = true,
        include_timestamp = true,
        separator = " - ",
        line_ending = "CRLF",
      } = args;

      // Validate file exists
      if (!fs.existsSync(file_path)) {
        throw new Error(`File not found: ${file_path}`);
      }

      const client = getLintoClient();
      const file = await fs.openAsBlob(file_path);

      const handle = await client.transcribe(file, {
        enableDiarization: enable_diarization,
        numberOfSpeaker: number_of_speakers.toString(),
        language,
        enablePunctuation: enable_punctuation,
      });

      // Wait for transcription to complete
      const result = await new Promise((resolve, reject) => {
        handle.addEventListener("done", (e) => {
          resolve(e.detail);
        });

        handle.addEventListener("error", (e) => {
          reject(new Error(`Transcription failed: ${JSON.stringify(e.detail)}`));
        });
      });

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
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
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

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("LinTO MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
