import test from "ava"
import { isUnreachableResult } from "../isUnreachableResult.js"

test("isUnreachableResult() spots a failure without answer", (t) => {
  t.true(
    isUnreachableResult({ status: "error", error: { code: "ERR_NETWORK" } }),
  )
})

test("isUnreachableResult() leaves an answered refusal out", (t) => {
  t.false(
    isUnreachableResult({
      status: "error",
      error: { response: { status: 401 } },
    }),
  )
})

test("isUnreachableResult() leaves a success out", (t) => {
  t.false(isUnreachableResult({ status: "success", data: {} }))
})
