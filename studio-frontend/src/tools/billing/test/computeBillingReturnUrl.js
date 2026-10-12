import test from "ava"
import { computeBillingReturnUrl } from "../computeBillingReturnUrl.js"

test("reopens the billing tab on the current page", (t) => {
  t.is(
    computeBillingReturnUrl("http://front.test/interface/o/explore"),
    "http://front.test/interface/o/explore?settings=billing",
  )
})

test("drops the status of a previous round trip and keeps the rest", (t) => {
  t.is(
    computeBillingReturnUrl(
      "http://front.test/interface/o/explore?tab=a&type=credits&status=success",
    ),
    "http://front.test/interface/o/explore?tab=a&settings=billing",
  )
})

test("replaces another requested settings tab", (t) => {
  t.is(
    computeBillingReturnUrl(
      "http://front.test/interface/o/explore?settings=members",
    ),
    "http://front.test/interface/o/explore?settings=billing",
  )
})
