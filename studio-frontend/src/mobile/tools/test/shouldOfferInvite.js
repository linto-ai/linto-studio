import test from "ava"
import { shouldOfferInvite } from "../shouldOfferInvite.js"

const shared = [{ email: "ana@example.org" }]

test("shouldOfferInvite() offers an unknown email", (t) => {
  t.true(shouldOfferInvite(" bob@example.org ", [], shared))
})

test("shouldOfferInvite() refuses non-emails and known addresses", (t) => {
  t.false(shouldOfferInvite("bob", [], shared))
  t.false(shouldOfferInvite("ANA@example.org", [], shared))
  t.false(
    shouldOfferInvite(
      "bob@example.org",
      [{ email: "bob@example.org" }],
      shared,
    ),
  )
})
