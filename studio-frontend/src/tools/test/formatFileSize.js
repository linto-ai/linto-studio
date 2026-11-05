import test from "ava"
import { formatFileSize } from "../formatFileSize.js"

// Intl separates the value and the unit with a non-breaking space.
function formatWithPlainSpaces(bytes, locale) {
  return formatFileSize(bytes, locale).replace(/\s/g, " ")
}

test("picks the unit of the size", (t) => {
  t.is(formatWithPlainSpaces(512, "fr-FR"), "512 o")
  t.is(formatWithPlainSpaces(2048, "fr-FR"), "2 ko")
  t.is(formatWithPlainSpaces(3 * 1024 * 1024, "fr-FR"), "3 Mo")
})

test("gigabytes keep a decimal", (t) => {
  t.is(formatWithPlainSpaces(1.5 * 1024 ** 3, "fr-FR"), "1,5 Go")
})

test("stays on gigabytes above them", (t) => {
  t.is(formatWithPlainSpaces(2048 * 1024 ** 3, "en-US"), "2,048 GB")
})

test("follows the locale", (t) => {
  t.is(formatWithPlainSpaces(3 * 1024 * 1024, "en-US"), "3 MB")
})

test("an empty file is zero bytes", (t) => {
  t.is(formatWithPlainSpaces(0, "fr-FR"), "0 o")
})
