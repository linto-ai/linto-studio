import test from "ava"
import { isValidEmail, EMAIL_REGEX } from "../isValidEmail.js"

test("accepts a simple email", (t) => {
  t.true(isValidEmail("user@example.com"))
})

test("accepts a plus-tagged email", (t) => {
  t.true(isValidEmail("user+filter@example.com"))
})

test("accepts a dotted local part", (t) => {
  t.true(isValidEmail("user.darboux@info.studio"))
})

test("accepts a subdomain", (t) => {
  t.true(isValidEmail("user@mail.example.co.uk"))
})

test("accepts a minimal email", (t) => {
  t.true(isValidEmail("a@b.c"))
})

test("trims surrounding whitespace before checking", (t) => {
  t.true(isValidEmail("  user@example.com  "))
})

test("rejects empty string", (t) => {
  t.false(isValidEmail(""))
})

test("rejects whitespace-only", (t) => {
  t.false(isValidEmail("   "))
})

test("rejects missing at-sign", (t) => {
  t.false(isValidEmail("user.example.com"))
})

test("rejects missing local part", (t) => {
  t.false(isValidEmail("@example.com"))
})

test("rejects missing domain", (t) => {
  t.false(isValidEmail("user@"))
})

test("rejects missing dot in domain", (t) => {
  t.false(isValidEmail("user@example"))
})

test("rejects whitespace inside", (t) => {
  t.false(isValidEmail("user @example.com"))
  t.false(isValidEmail("user@ example.com"))
  t.false(isValidEmail("user@exam ple.com"))
})

test("rejects multiple at-signs", (t) => {
  t.false(isValidEmail("user@@example.com"))
  t.false(isValidEmail("user@a@example.com"))
})

test("rejects non-string input", (t) => {
  t.false(isValidEmail(null))
  t.false(isValidEmail(undefined))
  t.false(isValidEmail(42))
  t.false(isValidEmail({}))
  t.false(isValidEmail([]))
})

test("exports the regex", (t) => {
  t.true(EMAIL_REGEX instanceof RegExp)
  t.true(EMAIL_REGEX.test("user@example.com"))
})
