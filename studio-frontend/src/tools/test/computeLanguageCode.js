import test from "ava"
import { computeLanguageCode } from "../computeLanguageCode.js"

test("computeLanguageCode() drops the region of a locale", (t) => {
  t.is(computeLanguageCode("en-US"), "en")
  t.is(computeLanguageCode("fr-FR"), "fr")
})

test("computeLanguageCode() keeps a bare language", (t) => {
  t.is(computeLanguageCode("en"), "en")
})

test("computeLanguageCode() returns an unparsable value unchanged", (t) => {
  t.is(computeLanguageCode(""), "")
  t.is(computeLanguageCode(undefined), undefined)
})
