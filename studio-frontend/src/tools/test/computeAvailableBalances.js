import test from "ava"
import { computeAvailableBalances } from "../computeAvailableBalances.js"

const NOW = new Date("2026-10-05T00:00:00Z")
const RESET_AT = "2026-11-01T00:00:00Z"
const AI_COSTS = { "ai.generations": 3, "ai.chat": 1 }

function freeUsage(fields = {}) {
  return {
    planKey: "free_payg",
    mode: "normal",
    capabilities: {
      "import.minutes": {
        type: "quota",
        used: 75,
        limit: 120,
        remaining: 45,
        unit: "minutes",
        resetAt: RESET_AT,
        topUp: { packKey: "transcription_5h", balance: 0, expiresAt: null },
      },
      "ai.credits": {
        type: "quota",
        used: 0,
        limit: 20,
        remaining: 20,
        unit: "credits",
        resetAt: RESET_AT,
        costs: AI_COSTS,
        topUp: { packKey: "transcription_5h", balance: 0, expiresAt: null },
      },
      "live.minutes": { type: "credit", balance: 0, expiresAt: null },
    },
    live: { balance: 0, unmetered: false },
    ...fields,
  }
}

function lot(fields) {
  return {
    _id: fields._id,
    kind: "live",
    source: "stripe",
    minutes: 300,
    remaining: 300,
    expiresAt: "2027-10-05T00:00:00Z",
    ...fields,
  }
}

function balanceOf(balances, key) {
  return balances.find((balance) => balance.key === key)
}

test("lists the three balances in display order", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage(),
    lots: [],
    now: NOW,
  })
  t.deepEqual(
    balances.map((balance) => [balance.key, balance.unit]),
    [
      ["transcription", "minutes"],
      ["live", "minutes"],
      ["ai", "credits"],
    ],
  )
})

test("the plan quota is the first source, with its reset date", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage(),
    lots: [],
    now: NOW,
  })
  const transcription = balanceOf(balances, "transcription")
  t.is(transcription.available, 45)
  t.deepEqual(transcription.sources, [
    { type: "plan", remaining: 45, total: 120, resetAt: RESET_AT },
  ])
})

test("adds the bought lots of the kind after the plan", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage(),
    lots: [
      lot({ _id: "t", kind: "transcription", remaining: 200 }),
      lot({ _id: "a", kind: "ai", minutes: 50, remaining: 32 }),
    ],
    now: NOW,
  })
  const transcription = balanceOf(balances, "transcription")
  t.is(transcription.available, 245)
  t.like(transcription.sources[1], {
    type: "packs",
    count: 1,
    remaining: 200,
    total: 300,
  })
  const ai = balanceOf(balances, "ai")
  t.is(ai.available, 52)
  t.like(ai.sources[1], { type: "packs", remaining: 32, total: 50 })
})

test("live is prepaid only: packs, earliest expiry first", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage(),
    lots: [
      lot({ _id: "late", minutes: 1200, remaining: 1200 }),
      lot({
        _id: "early",
        remaining: 186,
        expiresAt: "2027-05-10T00:00:00Z",
      }),
    ],
    now: NOW,
  })
  const live = balanceOf(balances, "live")
  t.is(live.available, 1386)
  t.deepEqual(live.sources, [
    {
      type: "packs",
      count: 2,
      remaining: 1386,
      total: 1500,
      expiresAt: "2027-05-10T00:00:00Z",
    },
  ])
})

test("offered lots are a source of their own", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage(),
    lots: [lot({ _id: "w", source: "welcome", minutes: 16, remaining: 16 })],
    now: NOW,
  })
  t.like(balanceOf(balances, "live").sources[0], {
    type: "offered",
    count: 1,
    remaining: 16,
  })
})

test("spent, expired and overdraft lots are left out", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage(),
    lots: [
      lot({ _id: "spent", remaining: 0 }),
      lot({ _id: "expired", expiresAt: "2026-01-01T00:00:00Z" }),
      lot({ _id: "debt", source: "overdraft", minutes: 0, remaining: -3 }),
    ],
    now: NOW,
  })
  const live = balanceOf(balances, "live")
  t.is(live.available, 0)
  t.deepEqual(live.sources, [])
})

test("lots of a quota the plan does not top up are not available", (t) => {
  const usage = freeUsage()
  delete usage.capabilities["import.minutes"].topUp
  const balances = computeAvailableBalances({
    usage,
    lots: [lot({ _id: "t", kind: "transcription" })],
    now: NOW,
  })
  t.is(balanceOf(balances, "transcription").sources.length, 1)
})

test("passes the AI costs on", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage(),
    lots: [],
    now: NOW,
  })
  t.deepEqual(balanceOf(balances, "ai").costs, AI_COSTS)
  t.is(balanceOf(balances, "live").costs, null)
})

test("comp and managed organizations are unlimited everywhere", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage({ mode: "comp" }),
    lots: [lot({ _id: "l" })],
    now: NOW,
  })
  t.true(balances.every((balance) => balance.isUnlimited))
  t.true(balances.every((balance) => balance.available === null))
  t.true(balances.every((balance) => balance.sources.length === 0))
  t.deepEqual(balanceOf(balances, "ai").costs, AI_COSTS)
})

test("a quota too large to mean anything is unlimited", (t) => {
  const usage = freeUsage()
  usage.capabilities["import.minutes"].limit = 24000
  const balances = computeAvailableBalances({ usage, lots: [], now: NOW })
  t.true(balanceOf(balances, "transcription").isUnlimited)
  t.false(balanceOf(balances, "ai").isUnlimited)
})

test("no usage gives empty balances", (t) => {
  const balances = computeAvailableBalances({
    usage: null,
    lots: null,
    now: NOW,
  })
  t.true(balances.every((balance) => balance.available === 0))
  t.true(balances.every((balance) => !balance.isUnlimited))
})

test("a debt on a lot is taken off what the lots hold", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage(),
    lots: [
      lot({
        _id: "overdrawn",
        remaining: -4,
        expiresAt: "2027-01-01T00:00:00Z",
      }),
      lot({ _id: "fresh" }),
    ],
    now: NOW,
  })
  const live = balanceOf(balances, "live")
  t.is(live.available, 296)
  t.like(live.sources[0], {
    type: "packs",
    count: 1,
    remaining: 296,
    total: 300,
  })
})

test("a debt never takes the lots below zero", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage(),
    lots: [
      lot({ _id: "debt", source: "overdraft", minutes: 0, remaining: -30 }),
      lot({ _id: "small", minutes: 10, remaining: 10 }),
    ],
    now: NOW,
  })
  t.is(balanceOf(balances, "live").available, 0)
})

test("tells which kinds of lots the plan consumes", (t) => {
  const usage = freeUsage()
  delete usage.capabilities["ai.credits"].topUp
  const balances = computeAvailableBalances({ usage, lots: [], now: NOW })
  t.deepEqual(
    balances.map((balance) => [balance.lotKind, balance.consumesLots]),
    [
      ["transcription", true],
      ["live", true],
      ["ai", false],
    ],
  )
})

test("an unlimited balance tells what was used and when it resets", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage({ mode: "managed" }),
    lots: [],
    now: NOW,
  })
  t.like(balanceOf(balances, "transcription"), {
    isUnlimited: true,
    used: 75,
    resetAt: RESET_AT,
  })
  t.like(balanceOf(balances, "live"), { used: null, resetAt: null })
})

test("a limited balance has no used figure of its own", (t) => {
  const balances = computeAvailableBalances({
    usage: freeUsage(),
    lots: [],
    now: NOW,
  })
  t.like(balanceOf(balances, "transcription"), { used: null, resetAt: null })
})

test("AI credits too many to mean anything are unlimited", (t) => {
  const usage = freeUsage()
  usage.capabilities["ai.credits"].limit = 4000
  const balances = computeAvailableBalances({ usage, lots: [], now: NOW })
  t.like(balanceOf(balances, "ai"), { isUnlimited: true, used: 0 })
  t.deepEqual(balanceOf(balances, "ai").costs, AI_COSTS)
})
