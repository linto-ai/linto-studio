import test from "ava"
import { computePackGroups } from "../computePackGroups.js"

const LIVE_5H = {
  packKey: "live_5h",
  kind: "live",
  minutes: 300,
  amountCents: 4500,
}
const LIVE_20H = {
  packKey: "live_20h",
  kind: "live",
  minutes: 1200,
  amountCents: 16000,
}
const LIVE_50H = {
  packKey: "live_50h",
  kind: "live",
  minutes: 3000,
  amountCents: 35000,
}
const TRANSCRIPTION_5H = {
  packKey: "transcription_5h",
  kind: "transcription",
  minutes: 300,
  amountCents: 1000,
}

test("groups packs by kind in the order kinds first appear", (t) => {
  const groups = computePackGroups([LIVE_5H, TRANSCRIPTION_5H, LIVE_20H])
  t.deepEqual(
    groups.map((group) => [group.kind, group.packs.map((p) => p.packKey)]),
    [
      ["live", ["live_5h", "live_20h"]],
      ["transcription", ["transcription_5h"]],
    ],
  )
})

test("sorts each group by minutes", (t) => {
  const [live] = computePackGroups([LIVE_50H, LIVE_5H, LIVE_20H])
  t.deepEqual(
    live.packs.map((p) => p.packKey),
    ["live_5h", "live_20h", "live_50h"],
  )
})

test("computes the hourly price and the saving against the dearest pack", (t) => {
  const [live] = computePackGroups([LIVE_5H, LIVE_20H, LIVE_50H])
  t.deepEqual(
    live.packs.map((p) => [p.hourlyCents, p.savingPercent]),
    [
      [900, null],
      [800, 11],
      [700, 22],
    ],
  )
})

test("a lone pack has no saving", (t) => {
  const [transcription] = computePackGroups([TRANSCRIPTION_5H])
  t.is(transcription.packs[0].hourlyCents, 200)
  t.is(transcription.packs[0].savingPercent, null)
})

test("returns no group without a catalog", (t) => {
  t.deepEqual(computePackGroups(null), [])
  t.deepEqual(computePackGroups([]), [])
})
