import test from "ava"
import { isLiveRequested } from "../isLiveRequested.js"
import { isOfflineRequested } from "../isOfflineRequested.js"
import { computeTimingOptions } from "../computeTimingOptions.js"
import { catalog } from "./helpers/fixtures.js"

test("a file is only transcribed at the end, whatever the timing says", (t) => {
  const draft = { source: "file", timing: "both" }
  t.false(isLiveRequested(draft))
  t.true(isOfflineRequested(draft))
})

test("a recording follows its timing", (t) => {
  const recording = (timing) => ({ source: "microphone", timing })
  t.true(isLiveRequested(recording("live")))
  t.false(isOfflineRequested(recording("live")))
  t.false(isLiveRequested(recording("offline")))
  t.true(isOfflineRequested(recording("offline")))
  t.true(isLiveRequested(recording("both")))
  t.true(isOfflineRequested(recording("both")))
})

function disabledTimings(securityLevel, availableCatalog) {
  return computeTimingOptions(securityLevel, availableCatalog)
    .filter((option) => option.disabled)
    .map((option) => option.name)
}

test("everything is offered with profiles and services", (t) => {
  t.deepEqual(disabledTimings(0, catalog), [])
})

test("no profile: only the end version is offered", (t) => {
  t.deepEqual(disabledTimings(0, { ...catalog, profiles: [] }), [
    "live",
    "both",
  ])
})

test("no service: only live is offered", (t) => {
  t.deepEqual(disabledTimings(0, { ...catalog, services: [] }), [
    "offline",
    "both",
  ])
})

test("engines under the security level don't count", (t) => {
  const lowLevelCatalog = {
    ...catalog,
    profiles: [{ meta: { securityLevel: 0 }, config: {} }],
  }
  t.deepEqual(disabledTimings(2, lowLevelCatalog), ["live", "both"])
})
