import test from "ava"
import { suggestTranslationTargets } from "../suggestTranslationTargets.js"

const options = [
  { code: "de-DE", label: "allemand" },
  { code: "en-US", label: "anglais" },
  { code: "es-ES", label: "espagnol" },
  { code: "ja-JP", label: "japonais" },
]

test("suggestTranslationTargets() keeps the targets the profile also hears", (t) => {
  const profile = {
    config: {
      languages: [
        { candidate: "fr-FR" },
        { candidate: "en-GB" },
        { candidate: "es-ES" },
      ],
    },
  }
  t.deepEqual(
    suggestTranslationTargets(profile, options).map((o) => o.code),
    ["en-US", "es-ES"],
  )
})

test("suggestTranslationTargets() returns nothing without candidates", (t) => {
  t.deepEqual(suggestTranslationTargets({}, options), [])
  t.deepEqual(suggestTranslationTargets(null, options), [])
})
