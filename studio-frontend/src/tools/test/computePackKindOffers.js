import test from "ava"
import { computePackKindOffers } from "../computePackKindOffers.js"

const LIVE_5H = {
  packKey: "live_5h",
  kind: "live",
  minutes: 300,
  amountCents: 4500,
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
  aiCredits: 50,
}

test("not an array gives no offer", (t) => {
  t.deepEqual(computePackKindOffers(null), [])
})

test("one offer per kind, in catalog order", (t) => {
  const offers = computePackKindOffers([LIVE_50H, LIVE_5H, TRANSCRIPTION_5H])
  t.deepEqual(
    offers.map((offer) => offer.kind),
    ["live", "transcription"],
  )
})

test("the smallest pack of each kind is its entry price", (t) => {
  const [live, transcription] = computePackKindOffers([
    LIVE_50H,
    LIVE_5H,
    TRANSCRIPTION_5H,
  ])
  t.is(live.pack.packKey, "live_5h")
  t.is(transcription.pack.packKey, "transcription_5h")
  t.is(transcription.pack.aiCredits, 50)
})

test("gives the lowest hourly price of the kind", (t) => {
  const [live] = computePackKindOffers([LIVE_5H, LIVE_50H])
  t.is(live.lowestHourlyCents, 700)
})
