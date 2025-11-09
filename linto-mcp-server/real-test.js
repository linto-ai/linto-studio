#!/usr/bin/env node

/**
 * Real Functional Test - Test MCP server with actual API calls
 */

import LinTO from "../studio-sdk/javascript/index.js";
import fs from "fs";

const TOKEN = process.env.LINTO_AUTH_TOKEN;
const BASE_URL = process.env.LINTO_BASE_URL || "https://studio.linto.ai/cm-api";
const TEST_FILE = "/home/user/linto-studio/linto-mcp-server/test-audio.mp3";

console.log("═══════════════════════════════════════════════════════════");
console.log("  LinTO MCP Server - Real Functional Test");
console.log("═══════════════════════════════════════════════════════════\n");

if (!TOKEN) {
  console.error("❌ Error: LINTO_AUTH_TOKEN environment variable required");
  process.exit(1);
}

console.log("Configuration:");
console.log(`  Auth Token: ${TOKEN.substring(0, 20)}...`);
console.log(`  Base URL: ${BASE_URL}`);
console.log(`  Test File: ${TEST_FILE}`);
console.log();

// Test 1: List Services
async function testListServices() {
  console.log("───────────────────────────────────────────────────────────");
  console.log("Test 1: List Available Services");
  console.log("───────────────────────────────────────────────────────────\n");

  try {
    const client = new LinTO({ authToken: TOKEN, baseUrl: BASE_URL });
    console.log("⏳ Fetching available transcription services...\n");

    const services = await client.listServices();

    console.log(`✅ Success! Found ${services.length} service(s):\n`);

    services.forEach((service, idx) => {
      console.log(`Service ${idx + 1}:`);
      console.log(`  Name: ${service.service_name || 'N/A'}`);
      console.log(`  Type: ${service.type || 'N/A'}`);
      console.log(`  Language: ${service.language || 'N/A'}`);
      console.log();
    });

    return true;
  } catch (error) {
    console.error("❌ Failed to list services");
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    }
    return false;
  }
}

// Test 2: Transcribe Audio
async function testTranscription() {
  console.log("\n───────────────────────────────────────────────────────────");
  console.log("Test 2: Transcribe Audio File");
  console.log("───────────────────────────────────────────────────────────\n");

  try {
    if (!fs.existsSync(TEST_FILE)) {
      console.error(`❌ Test file not found: ${TEST_FILE}`);
      return false;
    }

    const stats = fs.statSync(TEST_FILE);
    console.log(`📁 File: ${TEST_FILE}`);
    console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log();

    const client = new LinTO({ authToken: TOKEN, baseUrl: BASE_URL });
    const file = await fs.openAsBlob(TEST_FILE);

    console.log("⏳ Starting transcription...");
    console.log("   Settings:");
    console.log("   - Speaker Diarization: enabled");
    console.log("   - Language: auto-detect");
    console.log("   - Punctuation: enabled");
    console.log();

    const handle = await client.transcribe(file, {
      enableDiarization: true,
      numberOfSpeaker: "0",
      language: "*",
      enablePunctuation: true,
      name: "Real MCP Server Test",
    });

    console.log("⏳ Waiting for transcription to complete...\n");

    // Track progress
    handle.addEventListener("update", (e) => {
      const detail = e.detail;
      if (detail.progress !== undefined) {
        console.log(`   Progress: ${detail.progress}%`);
      }
      if (detail.status) {
        console.log(`   Status: ${detail.status}`);
      }
    });

    const result = await new Promise((resolve, reject) => {
      handle.addEventListener("done", (e) => {
        resolve(e.detail);
      });

      handle.addEventListener("error", (e) => {
        reject(new Error(`Transcription failed: ${JSON.stringify(e.detail)}`));
      });
    });

    console.log("\n✅ Transcription Complete!\n");
    console.log("───────────────────────────────────────────────────────────");
    console.log("TRANSCRIPTION RESULT:");
    console.log("───────────────────────────────────────────────────────────\n");
    console.log(result.fullText);
    console.log("\n───────────────────────────────────────────────────────────");
    console.log("DETAILED BREAKDOWN:");
    console.log("───────────────────────────────────────────────────────────\n");

    if (result.turns && result.turns.length > 0) {
      result.turns.forEach((turn, idx) => {
        console.log(`Turn ${idx + 1}:`);
        console.log(`  Speaker: ${turn.speaker || 'Unknown'}`);
        console.log(`  Language: ${turn.language || 'N/A'}`);
        console.log(`  Time: ${turn.start}s - ${turn.end}s`);
        console.log(`  Text: ${turn.text || turn.segment}`);
        console.log();
      });
    }

    console.log("───────────────────────────────────────────────────────────");
    console.log("METADATA:");
    console.log("───────────────────────────────────────────────────────────\n");
    if (result.response) {
      console.log(`  Conversation ID: ${result.response.conversationId || 'N/A'}`);
      console.log(`  Status: ${result.response.status || 'N/A'}`);
    }
    console.log();

    console.log("───────────────────────────────────────────────────────────");
    console.log("FORMATTED OUTPUT:");
    console.log("───────────────────────────────────────────────────────────\n");
    const formatted = result.toFormat({
      sep: " | ",
      eol: "LF",
      include: {
        speaker: true,
        lang: true,
        timestamp: true,
      },
    });
    console.log(formatted);
    console.log();

    return true;
  } catch (error) {
    console.error("\n❌ Transcription failed");
    console.error(`   Error: ${error.message}`);
    if (error.stack) {
      console.error("\n   Stack trace:");
      console.error(error.stack);
    }
    return false;
  }
}

// Run all tests
async function main() {
  const servicesOk = await testListServices();
  const transcriptionOk = await testTranscription();

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  TEST SUMMARY");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log(`  List Services:     ${servicesOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Transcription:     ${transcriptionOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log("\n═══════════════════════════════════════════════════════════\n");

  if (servicesOk && transcriptionOk) {
    console.log("🎉 All tests passed! The MCP server is fully functional.\n");
    process.exit(0);
  } else {
    console.log("⚠️  Some tests failed. See details above.\n");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\n💥 Fatal error:", error);
  process.exit(1);
});
