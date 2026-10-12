import test from "ava"
import { computePluralChoice } from "../computePluralChoice.js"

test("French reads 0 and 1 as singular", (t) => {
  t.is(computePluralChoice(0, "fr-FR"), 1)
  t.is(computePluralChoice(1, "fr-FR"), 1)
  t.is(computePluralChoice(2, "fr-FR"), 2)
})

test("English reads only 1 as singular", (t) => {
  t.is(computePluralChoice(0, "en-US"), 2)
  t.is(computePluralChoice(1, "en-US"), 1)
  t.is(computePluralChoice(52, "en-US"), 2)
})
