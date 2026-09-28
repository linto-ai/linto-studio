import test from "ava"
import { isSaasRefusal } from "../isSaasRefusal.js"

test("recognizes the SaaS refusal codes", (t) => {
  t.true(isSaasRefusal({ code: "SAAS_QUOTA_EXCEEDED" }))
  t.true(isSaasRefusal({ code: "SAAS_FEATURE_LOCKED" }))
})

test("rejects anything else", (t) => {
  t.false(isSaasRefusal({ code: "FILE_TOO_LARGE" }))
  t.false(isSaasRefusal(null))
  t.false(isSaasRefusal(undefined))
})
