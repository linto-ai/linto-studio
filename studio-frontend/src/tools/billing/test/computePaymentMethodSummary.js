import test from "ava"
import { computePaymentMethodSummary } from "../computePaymentMethodSummary.js"

test("a card shows its brand, last digits and expiry", (t) => {
  t.deepEqual(
    computePaymentMethodSummary({
      type: "card",
      brand: "visa",
      last4: "4242",
      expMonth: 4,
      expYear: 2027,
    }),
    { type: "card", brandLabel: "Visa", last4: "4242", expiry: "04/2027" },
  )
})

test("a brand missing from the table is capitalized", (t) => {
  const summary = computePaymentMethodSummary({
    type: "card",
    brand: "link",
    last4: "0000",
    expMonth: 12,
    expYear: 2030,
  })
  t.is(summary.brandLabel, "Link")
  t.is(summary.expiry, "12/2030")
})

test("an unknown brand gets no label", (t) => {
  const summary = computePaymentMethodSummary({
    type: "card",
    brand: "unknown",
    last4: "1111",
    expMonth: 1,
    expYear: 2028,
  })
  t.is(summary.brandLabel, null)
})

test("another payment method type has no brand nor expiry", (t) => {
  t.deepEqual(
    computePaymentMethodSummary({
      type: "sepa_debit",
      brand: null,
      last4: "3000",
      expMonth: null,
      expYear: null,
    }),
    { type: "sepa_debit", brandLabel: null, last4: "3000", expiry: null },
  )
})

test("no payment method, no summary", (t) => {
  t.is(computePaymentMethodSummary(null), null)
})
