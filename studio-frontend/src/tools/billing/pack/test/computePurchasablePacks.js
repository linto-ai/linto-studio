import test from "ava"
import { computePurchasablePacks } from "../computePurchasablePacks.js"

const LIVE_PACK = { packKey: "live_5h", kind: "live", plans: [] }
const TRANSCRIPTION_PACK = {
  packKey: "transcription_5h",
  kind: "transcription",
  plans: ["free_payg"],
}
const PACKS = [LIVE_PACK, TRANSCRIPTION_PACK]

function planWithLiveRule(planKey, rule) {
  return { planKey, entitlements: { "live.minutes": rule } }
}

const PURCHASABLE_CREDIT = { type: "credit", purchasable: true }

test("a restricted pack is sold to the plans of its list only", (t) => {
  const free = planWithLiveRule("free_payg", PURCHASABLE_CREDIT)
  const premium = planWithLiveRule("premium", PURCHASABLE_CREDIT)
  t.deepEqual(computePurchasablePacks(PACKS, free), PACKS)
  t.deepEqual(computePurchasablePacks(PACKS, premium), [LIVE_PACK])
})

test("an unrestricted pack needs a purchasable live credit", (t) => {
  const plan = planWithLiveRule("premium", {
    type: "credit",
    purchasable: false,
  })
  t.deepEqual(computePurchasablePacks([LIVE_PACK], plan), [])
})

test("an unrestricted pack is refused without a live credit rule", (t) => {
  t.deepEqual(computePurchasablePacks([LIVE_PACK], { planKey: "x" }), [])
  const quotaRule = planWithLiveRule("x", { type: "quota", purchasable: true })
  t.deepEqual(computePurchasablePacks([LIVE_PACK], quotaRule), [])
})

test("a pack without a plans field counts as unrestricted", (t) => {
  const pack = { packKey: "live_20h" }
  const plan = planWithLiveRule("business", PURCHASABLE_CREDIT)
  t.deepEqual(computePurchasablePacks([pack], plan), [pack])
})

test("nothing is purchasable while the catalog or the plan is unknown", (t) => {
  t.deepEqual(computePurchasablePacks(null, { planKey: "premium" }), [])
  t.deepEqual(computePurchasablePacks(PACKS, null), [])
})
