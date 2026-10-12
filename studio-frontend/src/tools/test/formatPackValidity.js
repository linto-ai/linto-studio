import test from "ava"
import { formatPackValidity } from "../formatPackValidity.js"

// Intl separates the number from its unit with a no-break space
function normalizeSpaces(text) {
  return text.replace(/\s/g, " ")
}

test("not an array has no validity", (t) => {
  t.is(formatPackValidity(null, "fr-FR"), null)
})

test("the validity the packs share, in months", (t) => {
  const packs = [{ validityDays: 365 }, { validityDays: 365 }]
  t.is(normalizeSpaces(formatPackValidity(packs, "fr-FR")), "12 mois")
  t.is(normalizeSpaces(formatPackValidity(packs, "en-US")), "12 months")
})

test("packs of different validities share none", (t) => {
  t.is(
    formatPackValidity([{ validityDays: 365 }, { validityDays: 30 }], "fr-FR"),
    null,
  )
})

test("a pack without validity has none", (t) => {
  t.is(formatPackValidity([{}], "fr-FR"), null)
  t.is(formatPackValidity([], "fr-FR"), null)
})
