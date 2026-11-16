import test from "ava"
import { computeApiFailure } from "../computeApiFailure.js"

function isHealthy(data) {
  return data?.status === "ok"
}

test("computeApiFailure() is null for the expected answer", (t) => {
  t.is(
    computeApiFailure({ status: "success", data: { status: "ok" } }, isHealthy),
    null,
  )
})

test("computeApiFailure() accepts any success by default", (t) => {
  t.is(computeApiFailure({ status: "success", data: {} }), null)
})

test("computeApiFailure() flags an unexpected success body", (t) => {
  t.deepEqual(
    computeApiFailure({ status: "success", data: "<html>" }, isHealthy),
    { reason: "unexpected" },
  )
})

test("computeApiFailure() keeps the HTTP status of an answer", (t) => {
  t.deepEqual(
    computeApiFailure({
      status: "error",
      error: { code: "ERR_BAD_RESPONSE", response: { status: 503 } },
    }),
    { reason: "http", status: 503 },
  )
})

test("computeApiFailure() spots a timeout", (t) => {
  t.deepEqual(
    computeApiFailure({ status: "error", error: { code: "ECONNABORTED" } }),
    { reason: "timeout" },
  )
  t.deepEqual(
    computeApiFailure({ status: "error", error: { code: "ETIMEDOUT" } }),
    { reason: "timeout" },
  )
})

test("computeApiFailure() defaults to a network failure", (t) => {
  t.deepEqual(
    computeApiFailure({ status: "error", error: { code: "ERR_NETWORK" } }),
    { reason: "network" },
  )
  t.deepEqual(computeApiFailure(undefined), { reason: "network" })
})
