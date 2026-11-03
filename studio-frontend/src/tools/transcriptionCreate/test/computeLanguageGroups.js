import test from "ava"
import { computeLanguageGroups } from "../computeLanguageGroups.js"

function option(code) {
  return { code, changesEngine: false }
}

test("suggested languages come first, then the others by name", (t) => {
  const groups = computeLanguageGroups(
    [option("nl"), option("en"), option("ar"), option("fr")],
    "fr-FR",
  )
  t.deepEqual(
    groups.map(({ code, group }) => [code, group]),
    [
      ["fr", "suggested"],
      ["en", "suggested"],
      ["ar", "all"],
      ["nl", "all"],
    ],
  )
})

test("names are localized and capitalized", (t) => {
  const [french] = computeLanguageGroups([option("fr")], "en-US")
  t.is(french.label, "French")
})
