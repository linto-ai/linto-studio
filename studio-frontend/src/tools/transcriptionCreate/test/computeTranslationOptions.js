import test from "ava"
import { computeTranslationOptions } from "../computeTranslationOptions.js"
import { createDraft } from "../createDraft.js"
import { catalog } from "./helpers/fixtures.js"

const baseDraft = {
  ...createDraft({ source: "microphone", securityLevel: 0 }),
  timing: "live",
  profileId: "french",
  profileChosenByUser: true,
  serviceName: "whisper",
}

test("offers the translations of every compatible profile", (t) => {
  t.deepEqual(computeTranslationOptions(baseDraft, catalog), [
    { code: "en" },
    { code: "es" },
    { code: "de" },
    { code: "ar" },
  ])
})

test("only offers what combines with the chosen translations", (t) => {
  const draft = { ...baseDraft, translations: ["en"], profileId: "bilingual" }
  t.deepEqual(computeTranslationOptions(draft, catalog), [
    { code: "en" },
    { code: "es" },
  ])
})

test("follows the chosen languages", (t) => {
  const draft = { ...baseDraft, languages: ["de"], profileId: "europe" }
  t.deepEqual(
    computeTranslationOptions(draft, catalog).map((option) => option.code),
    ["de", "ar"],
  )
})

test("a chosen translation stays listed, even out of reach", (t) => {
  const draft = { ...baseDraft, translations: ["pt"] }
  t.deepEqual(computeTranslationOptions(draft, catalog), [{ code: "pt" }])
})
