import test from "ava"
import { computePackUsage } from "../computePackUsage.js"

const NOW = new Date("2026-10-05T00:00:00Z")

function lot(fields) {
  return {
    kind: "transcription",
    source: "stripe",
    minutes: 300,
    remaining: 300,
    expiresAt: "2027-03-12T00:00:00Z",
    ...fields,
  }
}

test("no pack of the kind gives null", (t) => {
  t.is(computePackUsage(null, "transcription", { now: NOW }), null)
  t.is(
    computePackUsage([lot({ _id: "a", kind: "live" })], "transcription", {
      now: NOW,
    }),
    null,
  )
})

test("adds up what was used of every pack", (t) => {
  const usage = computePackUsage(
    [
      lot({ _id: "a", remaining: 120 }),
      lot({ _id: "b", minutes: 600, remaining: 600 }),
    ],
    "transcription",
    { now: NOW },
  )
  t.deepEqual(usage, { used: 180, total: 900 })
})

test("a spent pack keeps counting until it expires", (t) => {
  const usage = computePackUsage(
    [lot({ _id: "spent", remaining: 0 }), lot({ _id: "b", remaining: 300 })],
    "transcription",
    { now: NOW },
  )
  t.deepEqual(usage, { used: 300, total: 600 })
})

test("expired packs and overdrafts are left out", (t) => {
  const usage = computePackUsage(
    [
      lot({ _id: "expired", remaining: 0, expiresAt: "2026-10-01T00:00:00Z" }),
      lot({ _id: "debt", source: "overdraft", minutes: 0, remaining: -30 }),
      lot({ _id: "b", remaining: 200 }),
    ],
    "transcription",
    { now: NOW },
  )
  t.deepEqual(usage, { used: 100, total: 300 })
})
