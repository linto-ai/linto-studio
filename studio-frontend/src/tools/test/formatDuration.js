import test from "ava"
import { formatDuration, formatTime, formatDateTime } from "../formatDuration.js"

// formatDuration tests
test("formatDuration returns null for null input", (t) => {
  t.is(formatDuration(null), null)
})

test("formatDuration returns null for undefined input", (t) => {
  t.is(formatDuration(undefined), null)
})

test("formatDuration returns null for negative input", (t) => {
  t.is(formatDuration(-10), null)
})

test("formatDuration returns null for NaN input", (t) => {
  t.is(formatDuration(NaN), null)
})

test("formatDuration formats seconds only (default)", (t) => {
  t.is(formatDuration(45), "45s")
})

test("formatDuration formats minutes and seconds (default)", (t) => {
  t.is(formatDuration(125), "2m 5s")
})

test("formatDuration formats hours, minutes, and seconds (default)", (t) => {
  t.is(formatDuration(3725), "1h 2m 5s")
})

test("formatDuration formats zero correctly", (t) => {
  t.is(formatDuration(0), "0s")
})

test("formatDuration compact mode with seconds only", (t) => {
  t.is(formatDuration(45, { compact: true }), "00:45")
})

test("formatDuration compact mode with minutes and seconds", (t) => {
  t.is(formatDuration(125, { compact: true }), "02:05")
})

test("formatDuration compact mode with hours", (t) => {
  t.is(formatDuration(3725, { compact: true }), "01:02:05")
})

test("formatDuration compact mode with showZeroHours", (t) => {
  t.is(formatDuration(125, { compact: true, showZeroHours: true }), "00:02:05")
})

test("formatDuration handles large values", (t) => {
  t.is(formatDuration(36000), "10h 0m 0s")
})

// formatTime tests
test("formatTime returns null for null input", (t) => {
  t.is(formatTime(null), null)
})

test("formatTime returns null for undefined input", (t) => {
  t.is(formatTime(undefined), null)
})

test("formatTime returns null for invalid date string", (t) => {
  t.is(formatTime("not-a-date"), null)
})

test("formatTime formats valid ISO date string", (t) => {
  const result = formatTime("2024-01-15T14:30:45Z", "en-US")
  // The exact format depends on locale, but it should contain time parts
  t.truthy(result)
  t.true(typeof result === "string")
})

test("formatTime formats Date object", (t) => {
  const date = new Date("2024-01-15T14:30:45Z")
  const result = formatTime(date, "en-US")
  t.truthy(result)
  t.true(typeof result === "string")
})

// formatDateTime tests
test("formatDateTime returns null for null input", (t) => {
  t.is(formatDateTime(null), null)
})

test("formatDateTime returns null for invalid date string", (t) => {
  t.is(formatDateTime("invalid"), null)
})

test("formatDateTime formats valid ISO date string", (t) => {
  const result = formatDateTime("2024-01-15T14:30:45Z", "en-US")
  t.truthy(result)
  t.true(typeof result === "string")
  // Should contain year
  t.true(result.includes("2024"))
})
