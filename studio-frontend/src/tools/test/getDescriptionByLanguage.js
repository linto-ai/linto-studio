import test from "ava"
import getDescriptionByLanguage from "../getDescriptionByLanguage.js"

// ============================================
// Basic functionality tests
// ============================================

test("getDescriptionByLanguage() returns description for exact language match", (t) => {
  const descriptions = {
    fr: "Description en français",
    en: "English description",
  }
  t.is(getDescriptionByLanguage(descriptions, "fr"), "Description en français")
  t.is(getDescriptionByLanguage(descriptions, "en"), "English description")
})

test("getDescriptionByLanguage() handles language codes with region (e.g., fr-FR)", (t) => {
  const descriptions = {
    fr: "Description en français",
    en: "English description",
  }
  t.is(getDescriptionByLanguage(descriptions, "fr-FR"), "Description en français")
  t.is(getDescriptionByLanguage(descriptions, "en-US"), "English description")
})

// ============================================
// Fallback behavior tests
// ============================================

test("getDescriptionByLanguage() falls back to English when requested language not found", (t) => {
  const descriptions = {
    en: "English description",
    de: "Deutsche Beschreibung",
  }
  t.is(getDescriptionByLanguage(descriptions, "fr"), "English description")
})

test("getDescriptionByLanguage() falls back to first non-empty value when English not available", (t) => {
  const descriptions = {
    de: "Deutsche Beschreibung",
    es: "Descripción en español",
  }
  const result = getDescriptionByLanguage(descriptions, "fr")
  t.true(result === "Deutsche Beschreibung" || result === "Descripción en español")
})

test("getDescriptionByLanguage() returns custom fallback when no valid description found", (t) => {
  const descriptions = {}
  t.is(getDescriptionByLanguage(descriptions, "fr", "Default text"), "Default text")
})

test("getDescriptionByLanguage() returns null fallback by default when no description found", (t) => {
  const descriptions = {}
  t.is(getDescriptionByLanguage(descriptions, "fr"), null)
})

// ============================================
// Null/undefined handling tests
// ============================================

test("getDescriptionByLanguage() returns fallback for null description", (t) => {
  t.is(getDescriptionByLanguage(null, "fr"), null)
  t.is(getDescriptionByLanguage(null, "fr", "Default"), "Default")
})

test("getDescriptionByLanguage() returns fallback for undefined description", (t) => {
  t.is(getDescriptionByLanguage(undefined, "fr"), null)
  t.is(getDescriptionByLanguage(undefined, "fr", "Default"), "Default")
})

test("getDescriptionByLanguage() returns fallback for non-object description", (t) => {
  t.is(getDescriptionByLanguage("string", "fr"), null)
  t.is(getDescriptionByLanguage(123, "fr"), null)
  t.is(getDescriptionByLanguage(true, "fr"), null)
})

// ============================================
// Empty string handling tests
// ============================================

test("getDescriptionByLanguage() skips empty string values", (t) => {
  const descriptions = {
    fr: "",
    en: "English description",
  }
  t.is(getDescriptionByLanguage(descriptions, "fr"), "English description")
})

test("getDescriptionByLanguage() skips whitespace-only string values", (t) => {
  const descriptions = {
    fr: "   ",
    en: "English description",
  }
  t.is(getDescriptionByLanguage(descriptions, "fr"), "English description")
})

test("getDescriptionByLanguage() skips empty English and finds first non-empty", (t) => {
  const descriptions = {
    fr: "",
    en: "",
    de: "Deutsche Beschreibung",
  }
  t.is(getDescriptionByLanguage(descriptions, "fr"), "Deutsche Beschreibung")
})

test("getDescriptionByLanguage() returns fallback when all values are empty", (t) => {
  const descriptions = {
    fr: "",
    en: "   ",
    de: "",
  }
  t.is(getDescriptionByLanguage(descriptions, "fr"), null)
  t.is(getDescriptionByLanguage(descriptions, "fr", "Fallback"), "Fallback")
})

// ============================================
// Edge cases
// ============================================

test("getDescriptionByLanguage() handles single language description", (t) => {
  const descriptions = {
    fr: "Seule description",
  }
  t.is(getDescriptionByLanguage(descriptions, "fr"), "Seule description")
  t.is(getDescriptionByLanguage(descriptions, "en"), "Seule description")
})

test("getDescriptionByLanguage() handles null values in dictionary", (t) => {
  const descriptions = {
    fr: null,
    en: "English description",
  }
  // null is falsy, so it falls back to English
  t.is(getDescriptionByLanguage(descriptions, "fr"), "English description")
})

test("getDescriptionByLanguage() preserves whitespace in valid descriptions", (t) => {
  const descriptions = {
    fr: "  Description avec espaces  ",
  }
  t.is(getDescriptionByLanguage(descriptions, "fr"), "  Description avec espaces  ")
})

test("getDescriptionByLanguage() handles long language codes correctly", (t) => {
  const descriptions = {
    fr: "French",
    en: "English",
  }
  // Should extract first 2 characters
  t.is(getDescriptionByLanguage(descriptions, "french"), "French")
  t.is(getDescriptionByLanguage(descriptions, "en-GB-oxendict"), "English")
})
