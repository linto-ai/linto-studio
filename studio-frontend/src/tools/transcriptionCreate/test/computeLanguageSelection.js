import test from "ava"
import { computeLanguageSelection } from "../computeLanguageSelection.js"

test("picking a language replaces detection", (t) => {
  t.deepEqual(computeLanguageSelection(["*"], ["*", "fr"]), ["fr"])
})

test("picking detection replaces the languages", (t) => {
  t.deepEqual(computeLanguageSelection(["fr", "en"], ["fr", "en", "*"]), ["*"])
})

test("languages add up", (t) => {
  t.deepEqual(computeLanguageSelection(["fr"], ["fr", "en"]), ["fr", "en"])
})

test("an empty selection goes back to detection", (t) => {
  t.deepEqual(computeLanguageSelection(["fr"], []), ["*"])
  t.deepEqual(computeLanguageSelection(["*"], []), ["*"])
})
