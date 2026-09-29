import test from "ava"
import { getTemplateDisplayName } from "../getTemplateDisplayName.js"

const template = { name_fr: "Rapport", name_en: "Report" }

test("french locale prefers name_fr", (t) => {
  t.is(getTemplateDisplayName(template, "fr-FR"), "Rapport")
})

test("other locales prefer name_en", (t) => {
  t.is(getTemplateDisplayName(template, "en-US"), "Report")
})

test("falls back across languages then legacy name", (t) => {
  t.is(getTemplateDisplayName({ name_en: "Report" }, "fr-FR"), "Report")
  t.is(getTemplateDisplayName({ name: "Old" }, "en-US"), "Old")
  t.is(getTemplateDisplayName(null), "")
})
