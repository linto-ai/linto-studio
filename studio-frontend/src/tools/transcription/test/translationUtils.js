import test from "ava"
import {
  extractTranslationLangCode,
  normalizeAvailableTranslations,
  isQualifiedForCrossSubtitles,
} from "../translationUtils.js"

// extractTranslationLangCode
test("extractTranslationLangCode with string", (t) => {
  t.is(extractTranslationLangCode("fr"), "fr")
})

test("extractTranslationLangCode with object", (t) => {
  t.is(extractTranslationLangCode({ target: "de" }), "de")
})

// normalizeAvailableTranslations
test("normalizeAvailableTranslations with null", (t) => {
  t.deepEqual(normalizeAvailableTranslations(null), [])
})

test("normalizeAvailableTranslations with undefined", (t) => {
  t.deepEqual(normalizeAvailableTranslations(undefined), [])
})

test("normalizeAvailableTranslations with legacy array", (t) => {
  t.deepEqual(normalizeAvailableTranslations(["fr", "de"]), ["fr", "de"])
})

test("normalizeAvailableTranslations with new format", (t) => {
  const raw = {
    discrete: ["fr"],
    external: [{ translator: "deepl", languages: ["de", "es"] }],
  }
  t.deepEqual(normalizeAvailableTranslations(raw), ["fr", "de", "es"])
})

test("normalizeAvailableTranslations deduplicates", (t) => {
  const raw = {
    discrete: ["fr", "de"],
    external: [{ translator: "deepl", languages: ["de", "es"] }],
  }
  const result = normalizeAvailableTranslations(raw)
  t.deepEqual(result, ["fr", "de", "es"])
})

// isQualifiedForCrossSubtitles
test("isQualifiedForCrossSubtitles with valid 2-lang setup", (t) => {
  t.true(isQualifiedForCrossSubtitles(["fr", "en"], ["fr-FR", "en-US"]))
})

test("isQualifiedForCrossSubtitles with 1 language", (t) => {
  t.false(isQualifiedForCrossSubtitles(["fr"], ["fr-FR"]))
})

test("isQualifiedForCrossSubtitles with missing translation", (t) => {
  t.false(isQualifiedForCrossSubtitles(["fr"], ["fr-FR", "en-US"]))
})

test("isQualifiedForCrossSubtitles with object format translations", (t) => {
  t.true(
    isQualifiedForCrossSubtitles(
      [{ target: "fr" }, { target: "en" }],
      ["fr-FR", "en-US"],
    ),
  )
})

test("isQualifiedForCrossSubtitles with null languages", (t) => {
  t.false(isQualifiedForCrossSubtitles(["fr", "en"], null))
})
