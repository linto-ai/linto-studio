#!/usr/bin/env node

/**
 * Test script for LinTO MCP Server
 *
 * This script tests the LinTO SDK integration directly (not the MCP server itself).
 * To test the MCP server, use an MCP client like Claude Desktop.
 *
 * Usage:
 *   export LINTO_AUTH_TOKEN="your-token"
 *   export TEST_AUDIO_FILE="/path/to/audio.mp3"
 *   node test.js
 */

import LinTO from "@linto-ai/linto";

async function testListServices() {
  console.log("\n=== Testing List Services ===\n");

  const authToken = process.env.LINTO_AUTH_TOKEN;
  const baseUrl = process.env.LINTO_BASE_URL || "https://studio.linto.ai/cm-api";

  if (!authToken) {
    console.error("Error: LINTO_AUTH_TOKEN environment variable is required");
    console.error("Get your token from https://studio.linto.ai");
    process.exit(1);
  }

  try {
    const client = new LinTO({ authToken, baseUrl });
    const services = await client.listServices();

    console.log("Available Services:");
    console.log(JSON.stringify(services, null, 2));
    console.log(`\nFound ${services.length} service(s)`);

    return true;
  } catch (error) {
    console.error("Error listing services:", error.message);
    return false;
  }
}

async function testTranscription() {
  console.log("\n=== Testing Transcription ===\n");

  const authToken = process.env.LINTO_AUTH_TOKEN;
  const baseUrl = process.env.LINTO_BASE_URL || "https://studio.linto.ai/cm-api";
  const testFile = process.env.TEST_AUDIO_FILE;

  if (!authToken) {
    console.error("Error: LINTO_AUTH_TOKEN environment variable is required");
    process.exit(1);
  }

  if (!testFile) {
    console.log("Skipping transcription test: TEST_AUDIO_FILE not set");
    console.log("To test transcription, set: export TEST_AUDIO_FILE=/path/to/audio.mp3");
    return true;
  }

  try {
    const fs = await import("fs");

    if (!fs.existsSync(testFile)) {
      console.error(`Error: Test file not found: ${testFile}`);
      return false;
    }

    console.log(`Transcribing file: ${testFile}`);

    const client = new LinTO({ authToken, baseUrl });
    const file = await fs.openAsBlob(testFile);

    const handle = await client.transcribe(file, {
      enableDiarization: true,
      numberOfSpeaker: "0",
      language: "*",
      enablePunctuation: true,
      name: "MCP Server Test",
    });

    console.log("Transcription started, waiting for completion...");

    const result = await new Promise((resolve, reject) => {
      handle.addEventListener("update", (e) => {
        console.log("Progress:", e.detail);
      });

      handle.addEventListener("done", (e) => {
        resolve(e.detail);
      });

      handle.addEventListener("error", (e) => {
        reject(new Error(`Transcription failed: ${JSON.stringify(e.detail)}`));
      });
    });

    console.log("\n--- Transcription Result ---\n");
    console.log("Full Text:");
    console.log(result.fullText);
    console.log("\n--- Formatted Output ---\n");
    console.log(result.toFormat());
    console.log("\n--- Turns ---\n");
    console.log(JSON.stringify(result.turns, null, 2));

    return true;
  } catch (error) {
    console.error("Error during transcription:", error.message);
    console.error(error.stack);
    return false;
  }
}

async function main() {
  console.log("===========================================");
  console.log("LinTO MCP Server - SDK Integration Test");
  console.log("===========================================");

  const servicesOk = await testListServices();
  const transcriptionOk = await testTranscription();

  console.log("\n===========================================");
  console.log("Test Results:");
  console.log(`  List Services: ${servicesOk ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  Transcription: ${transcriptionOk ? '✓ PASS' : '✗ FAIL'}`);
  console.log("===========================================\n");

  if (!servicesOk || !transcriptionOk) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
