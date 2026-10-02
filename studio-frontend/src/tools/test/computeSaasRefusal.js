import test from "ava"
import { computeSaasRefusal } from "../computeSaasRefusal.js"

const ADMIN = { isAdmin: true, canBuyPlan: false }
const FREE_PERSONAL_ADMIN = { isAdmin: true, canBuyPlan: true }
const MEMBER = { isAdmin: false, canBuyPlan: false }

const LIVE_CREDIT = {
  code: "SAAS_QUOTA_EXCEEDED",
  reason: "credit_exhausted",
  capability: "live.minutes",
}
function importQuota(remaining, topUp = null) {
  return {
    code: "SAAS_QUOTA_EXCEEDED",
    reason: "quota_exceeded",
    capability: "import.minutes",
    remaining,
    topUp,
  }
}
const PACK = { packKey: "transcription_5h", balance: 0 }

function keysOf(refusal) {
  return refusal.messages.map((m) => m.key)
}

test("ignores an error that is not a SaaS refusal", (t) => {
  t.is(computeSaasRefusal(null, ADMIN), null)
  t.is(computeSaasRefusal({ code: "FILE_TOO_LARGE" }, ADMIN), null)
})

test("sends an admin out of live credit to the packs", (t) => {
  const refusal = computeSaasRefusal(LIVE_CREDIT, ADMIN)
  t.deepEqual(keysOf(refusal), ["billing.refusal.live_credit"])
  t.is(refusal.action, "buy_pack")
})

test("tells anyone but an admin to contact one", (t) => {
  const refusal = computeSaasRefusal(LIVE_CREDIT, MEMBER)
  t.deepEqual(keysOf(refusal), [
    "billing.refusal.live_credit",
    "billing.refusal.contact_admin",
  ])
  t.is(refusal.action, "contact_admin")
})

test("never reads a failure of the engine as a lack of credit", (t) => {
  const refusal = computeSaasRefusal(
    {
      code: "SAAS_FEATURE_LOCKED",
      reason: "internal_error",
      capability: "live.minutes",
    },
    ADMIN,
  )
  t.deepEqual(keysOf(refusal), ["billing.refusal.unknown"])
  t.is(refusal.action, null)
})

test("offers the transcription pack when the quota has one", (t) => {
  const refusal = computeSaasRefusal(importQuota(0, PACK), ADMIN)
  t.deepEqual(keysOf(refusal), ["billing.refusal.import_exhausted"])
  t.is(refusal.action, "buy_pack")
})

test("offers the plans only to a free personal org", (t) => {
  t.is(computeSaasRefusal(importQuota(0), FREE_PERSONAL_ADMIN).action, "plans")
})

test("gives a paid org the reset date instead of a dead-end offer", (t) => {
  const refusal = computeSaasRefusal(importQuota(0), {
    ...ADMIN,
    importResetLabel: "20 octobre",
  })
  t.deepEqual(refusal.messages, [
    { key: "billing.refusal.import_exhausted" },
    { key: "billing.refusal.import_reset", params: { date: "20 octobre" } },
  ])
  t.is(refusal.action, null)
})

test("names the refused file and says what is left", (t) => {
  const refusal = computeSaasRefusal(importQuota(45), {
    ...FREE_PERSONAL_ADMIN,
    fileName: "interview.mp3",
  })
  t.deepEqual(refusal.messages, [
    {
      key: "billing.refusal.import_file_too_long",
      params: { remaining: "45 min", name: "interview.mp3" },
    },
  ])
})

test("treats less than a minute left as exhausted", (t) => {
  const refusal = computeSaasRefusal(importQuota(0.3, PACK), ADMIN)
  t.deepEqual(keysOf(refusal), ["billing.refusal.import_exhausted"])
})

test("has no call to action for a locked team org, an unverified email or a feature out of the offer", (t) => {
  for (const reason of [
    "team_plan_required",
    "email_not_verified",
    "feature_disabled",
  ]) {
    const refusal = computeSaasRefusal(
      { code: "SAAS_FEATURE_LOCKED", reason, capability: "import.minutes" },
      ADMIN,
    )
    t.is(refusal.action, null, reason)
  }
})
