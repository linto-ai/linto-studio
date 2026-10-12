import test from "ava"
import { computeCheckoutReturn } from "../computeCheckoutReturn.js"

test("returns the checkout outcome and the query without it", (t) => {
  t.deepEqual(
    computeCheckoutReturn({ type: "credits", status: "success", page: "2" }),
    { type: "credits", status: "success", query: { page: "2" } },
  )
})

test("returns null when the URL is not a checkout return", (t) => {
  t.is(computeCheckoutReturn({ page: "2" }), null)
  t.is(computeCheckoutReturn({}), null)
  t.is(computeCheckoutReturn(undefined), null)
})

test("needs both the type and the status", (t) => {
  t.is(computeCheckoutReturn({ type: "credits" }), null)
  t.is(computeCheckoutReturn({ status: "success" }), null)
  t.is(computeCheckoutReturn({ type: "", status: "success" }), null)
})

test("ignores a repeated parameter", (t) => {
  t.is(
    computeCheckoutReturn({ type: ["credits", "x"], status: "success" }),
    null,
  )
})
