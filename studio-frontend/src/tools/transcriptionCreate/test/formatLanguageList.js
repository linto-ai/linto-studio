import test from "ava"
import { formatLanguageList } from "../formatLanguageList.js"

test("lists the languages in the locale", (t) => {
  t.is(formatLanguageList(["fr", "en"], "en-US"), "French and English")
})

test("leaves detection out", (t) => {
  t.is(formatLanguageList(["*", "fr-FR"], "en-GB"), "French (France)")
})
