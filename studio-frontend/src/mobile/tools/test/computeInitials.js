import test from "ava"
import { computeInitials } from "../computeInitials.js"

test("computeInitials() takes the first and last word", (t) => {
  t.is(computeInitials("Damien Laine"), "DL")
  t.is(computeInitials("Jean de la Fontaine"), "JF")
  t.is(computeInitials("  Damien   Laine  "), "DL")
})

test("computeInitials() takes two characters of a single word", (t) => {
  t.is(computeInitials("Madonna"), "MA")
  t.is(computeInitials(""), "")
  t.is(computeInitials(undefined), "")
})
