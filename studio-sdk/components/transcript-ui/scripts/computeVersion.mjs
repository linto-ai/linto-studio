#!/usr/bin/env node
// Prints the version to publish the SDK under, from what the registry
// already has (see scripts/version/):
//   node scripts/computeVersion.mjs stable    # master: the next stable
//   node scripts/computeVersion.mjs unstable  # next: <next stable>-unstable.<UTC minute>
//
// package.json's version is a floor, never a published number: it must stay
// a plain x.y.z (a suffixed one is a leaked publish bump).
import { readFileSync } from "node:fs"
import { parseStableVersion } from "./version/parseStableVersion.mjs"
import { computeNextStableVersion } from "./version/computeNextStableVersion.mjs"
import { computeUnstableVersion } from "./version/computeUnstableVersion.mjs"

// publish-all.sh publishes it first: a number a failed run already burned on
// some packages is skipped, never retried (npm refuses a republish).
const REGISTRY_PACKAGE = "@linto-ai/transcript-ui-i18n"

const channel = process.argv[2]
if (channel !== "stable" && channel !== "unstable") {
  fail("usage: node scripts/computeVersion.mjs <stable|unstable>")
}

const manifest = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
)
if (!parseStableVersion(manifest.version)) {
  fail(
    `package.json holds ${manifest.version}: commit a plain x.y.z version, the suffix is added at publish time.`,
  )
}

const stableVersion = computeNextStableVersion(
  await fetchPublishedVersions(REGISTRY_PACKAGE),
  manifest.version,
)
console.log(
  channel === "stable"
    ? stableVersion
    : computeUnstableVersion(stableVersion, new Date()),
)

async function fetchPublishedVersions(name) {
  const url = `https://registry.npmjs.org/${name.replace("/", "%2F")}`
  try {
    const response = await fetch(url, {
      headers: { accept: "application/vnd.npm.install-v1+json" },
    })
    if (response.status === 404) return []
    if (!response.ok) fail(`${url} answered ${response.status}`)
    return Object.keys((await response.json()).versions)
  } catch (error) {
    fail(`${url} unreachable: ${error.message}`)
  }
}

function fail(message) {
  console.error(`[computeVersion] ${message}`)
  process.exit(1)
}
