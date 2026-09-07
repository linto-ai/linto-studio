import test from "ava"
import { exportFilename } from "../llm/exportFilename.js"

// formatTimestamp() yields 14 digits (yyyyMMddHHmmss). We don't pin the clock,
// we just check the shape so the test stays deterministic.
const TIMESTAMP_RE = /\d{14}/

test("exportFilename combines name, timestamp and extension", (t) => {
  const out = exportFilename("Meeting Notes", "pdf")
  t.regex(out, /^Meeting_Notes_\d{14}\.pdf$/)
})

test("exportFilename accepts an extension with leading dot", (t) => {
  const out = exportFilename("Demo", ".docx")
  t.regex(out, /^Demo_\d{14}\.docx$/)
})

test("exportFilename replaces spaces in the name with underscores", (t) => {
  const out = exportFilename("hello world  again", "txt")
  t.regex(out, /^hello_world__again_\d{14}\.txt$/)
})

test("exportFilename falls back to 'export' on empty name", (t) => {
  const out = exportFilename("", "json")
  t.regex(out, /^export_\d{14}\.json$/)
})

test("exportFilename falls back to 'export' on null/undefined name", (t) => {
  t.regex(exportFilename(null, "txt"), /^export_\d{14}\.txt$/)
  t.regex(exportFilename(undefined, "txt"), /^export_\d{14}\.txt$/)
})

test("exportFilename embeds a 14-digit timestamp", (t) => {
  const out = exportFilename("foo", "pdf")
  t.regex(out, TIMESTAMP_RE)
})
