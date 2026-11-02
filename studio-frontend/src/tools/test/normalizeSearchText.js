import test from "ava"
import { normalizeSearchText } from "../normalizeSearchText.js"

test("removes case and accents", (t) => {
  t.is(normalizeSearchText("Néerlandais"), "neerlandais")
  t.is(normalizeSearchText("FRANÇAIS"), "francais")
})
