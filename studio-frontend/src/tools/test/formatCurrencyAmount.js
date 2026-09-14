import test from "ava"
import { formatCurrencyAmount } from "../formatCurrencyAmount.js"

// Intl inserts a non-breaking space (U+00A0) between the number and the "€" sign.
const NBSP = " "

test("formatCurrencyAmount() formats a round amount without decimals", (t) => {
  t.is(formatCurrencyAmount(1900, "eur", "fr-FR"), `19${NBSP}€`)
})

test("formatCurrencyAmount() formats a non-round amount with decimals", (t) => {
  t.is(formatCurrencyAmount(1650, "eur", "fr-FR"), `16,50${NBSP}€`)
})

test("formatCurrencyAmount() defaults to eur/fr-FR", (t) => {
  t.is(formatCurrencyAmount(0), `0${NBSP}€`)
})

test("formatCurrencyAmount() respects the given locale", (t) => {
  t.is(formatCurrencyAmount(1900, "eur", "en-US"), "€19")
})

test("formatCurrencyAmount() handles null/undefined as zero", (t) => {
  t.is(formatCurrencyAmount(null), `0${NBSP}€`)
  t.is(formatCurrencyAmount(undefined), `0${NBSP}€`)
})
