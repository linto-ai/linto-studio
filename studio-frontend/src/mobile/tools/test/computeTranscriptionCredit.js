import test from "ava"
import { computeTranscriptionCredit } from "../computeTranscriptionCredit.js"

const NOW = new Date("2026-10-05T00:00:00Z")
const RESET_AT = "2026-11-01T00:00:00Z"

function usageWith(quota, fields = {}) {
  return {
    mode: "normal",
    capabilities: {
      "import.minutes": {
        type: "quota",
        unit: "minutes",
        resetAt: RESET_AT,
        topUp: { packKey: "transcription_5h" },
        ...quota,
      },
    },
    ...fields,
  }
}

const TRANSCRIPTION_LOT = {
  kind: "transcription",
  source: "stripe",
  minutes: 300,
  remaining: 100,
  expiresAt: "2027-10-01T00:00:00Z",
}

test("computeTranscriptionCredit() adds the plan quota and the packs", (t) => {
  const credit = computeTranscriptionCredit({
    usage: usageWith({ used: 75, limit: 120, remaining: 45 }),
    lots: [TRANSCRIPTION_LOT],
    now: NOW,
  })
  t.deepEqual(credit, { minutes: 145, resetAt: RESET_AT })
})

test("computeTranscriptionCredit() reaches zero once all is spent", (t) => {
  const credit = computeTranscriptionCredit({
    usage: usageWith({ used: 120, limit: 120, remaining: 0 }),
    lots: [],
    now: NOW,
  })
  t.deepEqual(credit, { minutes: 0, resetAt: RESET_AT })
})

test("computeTranscriptionCredit() has nothing to count without a limit", (t) => {
  t.is(
    computeTranscriptionCredit({
      usage: usageWith({ used: 10, limit: null }),
      lots: [],
      now: NOW,
    }),
    null,
  )
  t.is(
    computeTranscriptionCredit({
      usage: usageWith({ used: 10, limit: 120 }, { mode: "comp" }),
      lots: [],
      now: NOW,
    }),
    null,
  )
})

test("computeTranscriptionCredit() has nothing to count without usage", (t) => {
  t.is(computeTranscriptionCredit({ usage: null, lots: [], now: NOW }), null)
  t.is(
    computeTranscriptionCredit({
      usage: { mode: "normal", capabilities: {} },
      lots: [],
      now: NOW,
    }),
    null,
  )
})
