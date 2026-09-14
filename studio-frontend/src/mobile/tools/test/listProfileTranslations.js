import test from "ava"
import { listProfileTranslations } from "../listProfileTranslations.js"

test("listProfileTranslations() names and sorts string and object targets", (t) => {
  const profile = { translations: ["es-ES", { target: "en-US" }, "de-DE"] }
  const list = listProfileTranslations(profile, "fr-FR")
  t.deepEqual(
    list.map((item) => item.code),
    ["de-DE", "en-US", "es-ES"],
  )
  t.is(list[1].label, "anglais américain")
})

test("listProfileTranslations() dedupes and tolerates a profile without translations", (t) => {
  t.deepEqual(
    listProfileTranslations({ translations: ["en-US", "en-US"] }, "en-US")
      .length,
    1,
  )
  t.deepEqual(listProfileTranslations({}, "en-US"), [])
  t.deepEqual(listProfileTranslations(null, "en-US"), [])
})
