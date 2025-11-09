#!/usr/bin/env node

/**
 * Direct API Test - Test LinTO API directly with axios
 * This bypasses the SDK which uses native fetch (has DNS issues in sandbox)
 */

import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const TOKEN = process.env.LINTO_AUTH_TOKEN;
const BASE_URL = "https://studio.linto.ai/cm-api";
const TEST_FILE = "/home/user/linto-studio/linto-mcp-server/test-audio.mp3";

console.log("═══════════════════════════════════════════════════════════");
console.log("  LinTO API Direct Test (using axios)");
console.log("═══════════════════════════════════════════════════════════\n");

if (!TOKEN) {
  console.error("❌ Error: LINTO_AUTH_TOKEN required");
  process.exit(1);
}

console.log("Configuration:");
console.log(`  Token: ${TOKEN.substring(0, 20)}...`);
console.log(`  Base URL: ${BASE_URL}`);
console.log();

// Test 1: Test basic connectivity
async function testConnectivity() {
  console.log("───────────────────────────────────────────────────────────");
  console.log("Test 1: API Connectivity");
  console.log("───────────────────────────────────────────────────────────\n");

  const endpoints = [
    `${BASE_URL}/api/services`,
    `${BASE_URL}/api/organizations`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`⏳ Testing: ${endpoint}`);
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "User-Agent": "LinTO-MCP-Server/1.0.0",
        },
        timeout: 10000,
      });

      console.log(`✅ Success! Status: ${response.status}`);
      console.log(`   Response size: ${JSON.stringify(response.data).length} bytes`);

      if (Array.isArray(response.data)) {
        console.log(`   Found ${response.data.length} items`);
      }
      console.log();
      return { success: true, endpoint, data: response.data };
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data).substring(0, 200)}`);
      }
      if (error.code) {
        console.log(`   Error code: ${error.code}`);
      }
      console.log();
    }
  }

  return { success: false };
}

// Test 2: List Services
async function testListServices() {
  console.log("───────────────────────────────────────────────────────────");
  console.log("Test 2: List ASR Services");
  console.log("───────────────────────────────────────────────────────────\n");

  try {
    console.log("⏳ Fetching available transcription services...\n");

    const response = await axios.get(`${BASE_URL}/api/services`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "User-Agent": "LinTO-MCP-Server/1.0.0",
      },
      timeout: 10000,
    });

    console.log(`✅ Success! Found ${response.data.length} service(s):\n`);

    response.data.forEach((service, idx) => {
      console.log(`Service ${idx + 1}:`);
      console.log(`  Name: ${service.serviceName || service.service_name || 'N/A'}`);
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
      console.error(`   Headers:`, error.response.headers);
      console.error(`   Data:`, error.response.data);
    }
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    return false;
  }
}

// Test 3: Upload and Transcribe
async function testTranscription() {
  console.log("\n───────────────────────────────────────────────────────────");
  console.log("Test 3: Upload and Transcribe Audio");
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

    // Create form data
    const formData = new FormData();
    formData.append("file", fs.createReadStream(TEST_FILE));
    formData.append("enableDiarization", "true");
    formData.append("numberOfSpeaker", "0");
    formData.append("language", "*");
    formData.append("enablePunctuation", "true");
    formData.append("name", "Real API Test");

    console.log("⏳ Uploading file and starting transcription...\n");

    const response = await axios.post(`${BASE_URL}/api/conversation`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${TOKEN}`,
        "User-Agent": "LinTO-MCP-Server/1.0.0",
      },
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log("✅ Upload successful!");
    console.log(`   Conversation ID: ${response.data.conversationId || response.data._id}`);
    console.log(`   Status: ${response.data.status || 'submitted'}`);
    console.log();

    return true;
  } catch (error) {
    console.error("❌ Transcription failed");
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    }
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    return false;
  }
}

// Run all tests
async function main() {
  const connectivityResult = await testConnectivity();
  const servicesOk = await testListServices();
  const transcriptionOk = await testTranscription();

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  TEST SUMMARY");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log(`  API Connectivity:  ${connectivityResult.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  List Services:     ${servicesOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Transcription:     ${transcriptionOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log("\n═══════════════════════════════════════════════════════════\n");

  if (connectivityResult.success || servicesOk || transcriptionOk) {
    console.log("✅ At least one test passed - API is accessible!\n");
  } else {
    console.log("⚠️  All tests failed. This may be due to network restrictions.\n");
  }
}

main().catch((error) => {
  console.error("\n💥 Fatal error:", error);
  process.exit(1);
});
