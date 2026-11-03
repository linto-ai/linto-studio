import test from "ava"
import { computeSaasRefusal } from "../../billing/computeSaasRefusal.js"
import { computeTranscriptionRefusal } from "../computeTranscriptionRefusal.js"

function usageWith(quota, fields = {}) {
  return {
    mode: "normal",
    capabilities: {
      "import.minutes": {
        type: "quota",
        limit: 100,
        remaining: 0,
        used: 100,
        ...quota,
      },
    },
    ...fields,
  }
}

const exhausted = { usage: usageWith({}), lots: [] }

test("no minute left: the request would be refused", (t) => {
  t.deepEqual(computeTranscriptionRefusal(exhausted), {
    code: "SAAS_QUOTA_EXCEEDED",
    reason: "quota_exceeded",
    capability: "import.minutes",
    remaining: 0,
    topUp: null,
  })
})

test("reads as a refusal for the forms", (t) => {
  const view = computeSaasRefusal(computeTranscriptionRefusal(exhausted), {
    isAdmin: true,
    canBuyPlan: true,
  })
  t.is(view.messages[0].key, "billing.refusal.import_exhausted")
  t.is(view.action, "plans")
})

test("offers the pack the plan can buy", (t) => {
  const topUp = { balance: 0 }
  const refusal = computeTranscriptionRefusal({
    usage: usageWith({ topUp }),
    lots: [],
  })
  t.deepEqual(refusal.topUp, topUp)
})

test("minutes left: nothing to refuse", (t) => {
  t.is(
    computeTranscriptionRefusal({
      usage: usageWith({ remaining: 5, used: 95 }),
      lots: [],
    }),
    null,
  )
})

test("minutes left below what the audio needs: refused with what remains", (t) => {
  const billing = { usage: usageWith({ remaining: 5, used: 95 }), lots: [] }
  const refusal = computeTranscriptionRefusal({
    ...billing,
    requiredMinutes: 6,
  })
  t.is(refusal.remaining, 5)
  t.is(computeTranscriptionRefusal({ ...billing, requiredMinutes: 5 }), null)
})

test("packs not read yet: nothing to conclude", (t) => {
  t.is(computeTranscriptionRefusal({ ...exhausted, lots: null }), null)
})

test("no usage or an unmetered organization: nothing to refuse", (t) => {
  t.is(computeTranscriptionRefusal({ usage: null, lots: [] }), null)
  t.is(
    computeTranscriptionRefusal({
      usage: usageWith({}, { mode: "comp" }),
      lots: [],
    }),
    null,
  )
})
