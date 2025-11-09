#!/usr/bin/env node

/**
 * Debug API - Check what's happening with the LinTO API
 */

import axios from "axios";

const TOKEN = process.env.LINTO_AUTH_TOKEN;
const BASE_URL = "https://studio.linto.ai/cm-api";

console.log("═══════════════════════════════════════════════════════════");
console.log("  LinTO API Debug Test");
console.log("═══════════════════════════════════════════════════════════\n");

// Test with no redirects to see where it's going
async function debugEndpoint(endpoint) {
  console.log(`\nTesting: ${endpoint}`);
  console.log("─".repeat(60));

  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "User-Agent": "LinTO-MCP-Server/1.0.0",
      },
      maxRedirects: 0,
      validateStatus: () => true, // Accept any status
      timeout: 10000,
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, JSON.stringify(response.headers, null, 2));

    if (response.headers.location) {
      console.log(`Redirect to: ${response.headers.location}`);
    }

    if (response.data) {
      const dataStr = typeof response.data === 'string'
        ? response.data.substring(0, 500)
        : JSON.stringify(response.data, null, 2).substring(0, 500);
      console.log(`Data: ${dataStr}`);
    }

    return response;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    if (error.code) {
      console.log(`Code: ${error.code}`);
    }
    return null;
  }
}

// Test different endpoints
async function main() {
  const endpoints = [
    `${BASE_URL}/api/services`,
    `${BASE_URL}/api/organizations`,
    `${BASE_URL}/api/conversation`,
    `https://studio.linto.ai/api/services`,  // Try without /cm-api
  ];

  for (const endpoint of endpoints) {
    await debugEndpoint(endpoint);
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  Token Info");
  console.log("═══════════════════════════════════════════════════════════\n");

  // Decode JWT to see what's in it
  const parts = TOKEN.split('.');
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      console.log("Token Payload:");
      console.log(JSON.stringify(payload, null, 2));

      // Check expiration
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        console.log(`\nExpires: ${expDate.toISOString()}`);
        console.log(`Now: ${now.toISOString()}`);
        console.log(`Valid: ${expDate > now ? 'Yes' : 'No (EXPIRED!)'}`);
      }
    } catch (e) {
      console.log("Could not decode token:", e.message);
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════\n");
}

main().catch(console.error);
