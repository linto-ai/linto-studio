import test from "ava"
import { PACK_KIND_PITCHES } from "../../../../const/pack/packKindPitches.js"
import { computePackOfferGroups } from "../computePackOfferGroups.js"

const LIVE_5H = {
  packKey: "live_5h",
  kind: "live",
  minutes: 300,
  amountCents: 4500,
}
const TRANSCRIPTION_5H = {
  packKey: "transcription_5h",
  kind: "transcription",
  minutes: 300,
  amountCents: 1000,
}
const API_5H = {
  packKey: "api_5h",
  kind: "api",
  minutes: 300,
  amountCents: 1000,
}

test("adds the title key, pitch and palette of the kind", (t) => {
  const [live] = computePackOfferGroups([LIVE_5H])
  t.like(live, {
    kind: "live",
    titleKey: PACK_KIND_PITCHES.live.titleKey,
    headlineKey: PACK_KIND_PITCHES.live.headlineKey,
    features: PACK_KIND_PITCHES.live.features,
    noteKey: PACK_KIND_PITCHES.live.noteKey,
    palette: { "--pack-accent": "var(--material-teal-800)" },
  })
  t.deepEqual(
    live.packs.map((pack) => pack.packKey),
    ["live_5h"],
  )
})

test("gives no pitch and the neutral palette to an unknown kind", (t) => {
  const [api] = computePackOfferGroups([API_5H])
  t.like(api, {
    titleKey: null,
    headlineKey: null,
    features: [],
    noteKey: null,
  })
  t.like(api.palette, { "--pack-accent": "var(--material-blue-grey-800)" })
})

test("gives the AI credits every pack of the group shares", (t) => {
  const [transcription] = computePackOfferGroups([
    { ...TRANSCRIPTION_5H, aiCredits: 50 },
    { ...TRANSCRIPTION_5H, packKey: "transcription_10h", aiCredits: 50 },
  ])
  t.is(transcription.aiCredits, 50)
})

test("gives no AI credits when the packs differ or have none", (t) => {
  const [transcription] = computePackOfferGroups([
    { ...TRANSCRIPTION_5H, aiCredits: 50 },
    { ...TRANSCRIPTION_5H, packKey: "transcription_10h", aiCredits: 100 },
  ])
  const [live] = computePackOfferGroups([LIVE_5H])
  t.is(transcription.aiCredits, null)
  t.is(live.aiCredits, null)
})

test("returns no group without packs", (t) => {
  t.deepEqual(computePackOfferGroups(null), [])
})
