import test from "ava"
import { computeCheckoutReturnUrl } from "../computeCheckoutReturnUrl.js"

test("drops the checkout status parameters and keeps the rest", (t) => {
  t.is(
    computeCheckoutReturnUrl(
      "http://front.test/interface/o/explore?tab=a&type=subscription&status=cancel",
    ),
    "http://front.test/interface/o/explore?tab=a",
  )
})

test("leaves a clean url untouched", (t) => {
  t.is(
    computeCheckoutReturnUrl("http://front.test/interface/o/explore"),
    "http://front.test/interface/o/explore",
  )
})
