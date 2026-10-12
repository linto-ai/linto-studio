import test from "ava"
import { PACK_KIND_PITCHES } from "../../../../const/pack/packKindPitches.js"
import { computePackOfferGroups } from "../computePackOfferGroups.js"

const LIVE_5H = {
  packKey: "live_5h",
  kind: "live",
  minutes: 300,
  amountCents: 4500,
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

test("returns no group without packs", (t) => {
  t.deepEqual(computePackOfferGroups(null), [])
})
