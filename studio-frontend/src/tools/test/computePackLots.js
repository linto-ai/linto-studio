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
  t.deepEqual(computePackLots(null, NOW), [])
})

test("computes what was consumed", (t) => {
  const [pack] = computePackLots([lot({ _id: "a", remaining: 120 })], NOW)
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
    NOW,
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
    NOW,
  )
  t.deepEqual(
    packs.map((pack) => pack.id),
    ["welcome"],
  )
})

test("keeps remaining within the granted minutes", (t) => {
  const [pack] = computePackLots(
    [lot({ _id: "a", minutes: 60, remaining: 90 })],
    NOW,
  )
  t.like(pack, { remaining: 60, consumed: 0 })
})

test("a lot without kind is a live lot", (t) => {
  const [pack] = computePackLots([lot({ _id: "a", kind: undefined })], NOW)
  t.is(pack.kind, "live")
})
