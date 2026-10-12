import test from "ava"
import { computePackLots } from "../computePackLots.js"

const NOW = new Date("2026-10-05T00:00:00Z")

function lot(fields) {
  return {
    _id: fields._id,
    kind: "live",
    source: "stripe",
    minutes: 300,
    remaining: 300,
    created: "2026-03-12T00:00:00Z",
    expiresAt: "2027-03-12T00:00:00Z",
    ...fields,
  }
}

test("not an array gives no pack", (t) => {
  t.deepEqual(computePackLots(null, { now: NOW }), [])
})

test("computes what was consumed", (t) => {
  const [pack] = computePackLots([lot({ _id: "a", remaining: 120 })], {
    now: NOW,
  })
  t.like(pack, {
    id: "a",
    minutes: 300,
    remaining: 120,
    consumed: 180,
    isExhausted: false,
  })
})

test("packs in use come by expiry, spent ones last", (t) => {
  const packs = computePackLots(
    [
      lot({ _id: "spent", remaining: 0, expiresAt: "2026-11-01T00:00:00Z" }),
      lot({ _id: "late", expiresAt: "2027-06-01T00:00:00Z" }),
      lot({ _id: "early", expiresAt: "2026-12-01T00:00:00Z" }),
    ],
    { now: NOW },
  )
  t.deepEqual(
    packs.map((pack) => pack.id),
    ["early", "late", "spent"],
  )
  t.true(packs[2].isExhausted)
})

test("leaves out expired lots and overdrafts", (t) => {
  const packs = computePackLots(
    [
      lot({ _id: "expired", expiresAt: "2026-01-01T00:00:00Z" }),
      lot({ _id: "debt", source: "overdraft", remaining: -30 }),
      lot({ _id: "welcome", source: "welcome", kind: "live" }),
    ],
    { now: NOW },
  )
  t.deepEqual(
    packs.map((pack) => pack.id),
    ["welcome"],
  )
})

test("keeps remaining within the granted minutes", (t) => {
  const [pack] = computePackLots(
    [lot({ _id: "a", minutes: 60, remaining: 90 })],
    { now: NOW },
  )
  t.like(pack, { remaining: 60, consumed: 0 })
})

test("a lot without kind is a live lot", (t) => {
  const [pack] = computePackLots([lot({ _id: "a", kind: undefined })], {
    now: NOW,
  })
  t.is(pack.kind, "live")
})

test("the first pack of each kind still holding minutes is current", (t) => {
  const packs = computePackLots(
    [
      lot({ _id: "spent", remaining: 0, expiresAt: "2026-11-01T00:00:00Z" }),
      lot({ _id: "live-late", expiresAt: "2027-06-01T00:00:00Z" }),
      lot({ _id: "live-early", expiresAt: "2026-12-01T00:00:00Z" }),
      lot({ _id: "file", kind: "transcription" }),
    ],
    { now: NOW },
  )
  t.deepEqual(
    packs.filter((pack) => pack.isCurrent).map((pack) => pack.id),
    ["live-early", "file"],
  )
})

test("attaches the AI credits bought with a transcription pack", (t) => {
  const ref = { packKey: "transcription_5h", stripeCheckoutSessionId: "cs_1" }
  const packs = computePackLots(
    [
      lot({ _id: "file", kind: "transcription", remaining: 200, ref }),
      lot({ _id: "ai", kind: "ai", minutes: 50, remaining: 32, ref }),
    ],
    { now: NOW },
  )
  t.deepEqual(
    packs.map((pack) => pack.id),
    ["file"],
  )
  t.deepEqual(packs[0].aiCredits, { remaining: 32, total: 50 })
})

test("AI credits of another payment, or of none, are not attached", (t) => {
  const packs = computePackLots(
    [
      lot({
        _id: "file",
        kind: "transcription",
        ref: { stripeCheckoutSessionId: "cs_1" },
      }),
      lot({
        _id: "other",
        kind: "ai",
        ref: { stripeCheckoutSessionId: "cs_2" },
      }),
      lot({ _id: "manual", kind: "ai", source: "manual" }),
    ],
    { now: NOW },
  )
  t.deepEqual(
    packs.map((pack) => pack.id),
    ["file"],
  )
  t.is(packs[0].aiCredits, null)
})

test("a pack whose minutes are spent stays in use while its AI credits last", (t) => {
  const ref = { stripeCheckoutSessionId: "cs_1" }
  const [pack] = computePackLots(
    [
      lot({ _id: "file", kind: "transcription", remaining: 0, ref }),
      lot({ _id: "ai", kind: "ai", minutes: 50, remaining: 40, ref }),
    ],
    { now: NOW },
  )
  t.false(pack.isExhausted)
  t.true(pack.isCurrent)
})

test("less than half a minute left is spent", (t) => {
  const [pack] = computePackLots([lot({ _id: "a", remaining: 0.3 })], {
    now: NOW,
  })
  t.true(pack.isExhausted)
  t.false(pack.isCurrent)
})

test("a kind the plan does not consume has no current pack", (t) => {
  const packs = computePackLots(
    [lot({ _id: "file", kind: "transcription" }), lot({ _id: "live" })],
    { now: NOW, consumedKinds: ["live"] },
  )
  t.deepEqual(
    packs.filter((pack) => pack.isCurrent).map((pack) => pack.id),
    ["live"],
  )
})
