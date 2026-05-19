import test from "ava"
import { isTokenExpiringSoon } from "../isTokenExpiringSoon.js"

const DAY = 24 * 60 * 60 * 1000
const NOW = new Date("2026-04-16T12:00:00Z").getTime()

const makeToken = (createdOffsetDays, expiresOffsetDays, extra = {}) => ({
  createdAt: new Date(NOW + createdOffsetDays * DAY).toISOString(),
  expiresAt: new Date(NOW + expiresOffsetDays * DAY).toISOString(),
  ...extra,
})

test("returns false when token is already flagged expired", (t) => {
  const token = makeToken(-10, 5, { expired: true })
  t.false(isTokenExpiringSoon(token, NOW))
})

test("returns false when createdAt is missing", (t) => {
  const token = { expiresAt: new Date(NOW + DAY).toISOString() }
  t.false(isTokenExpiringSoon(token, NOW))
})

test("returns false when expiresAt is missing", (t) => {
  const token = { createdAt: new Date(NOW - DAY).toISOString() }
  t.false(isTokenExpiringSoon(token, NOW))
})

test("returns false when dates are invalid", (t) => {
  const token = { createdAt: "not-a-date", expiresAt: "nope" }
  t.false(isTokenExpiringSoon(token, NOW))
})

test("returns false when total duration is non-positive", (t) => {
  const token = makeToken(5, 5)
  t.false(isTokenExpiringSoon(token, NOW))
})

test("returns false when token is already past expiration", (t) => {
  const token = makeToken(-30, -1)
  t.false(isTokenExpiringSoon(token, NOW))
})

test("short-lived token: threshold clamped to 1 day minimum", (t) => {
  // 2-day token, 20% ratio = 0.4d → clamped to 1 day
  // remaining 0.5d → below 1d threshold → true
  const token = makeToken(-1.5, 0.5)
  t.true(isTokenExpiringSoon(token, NOW))
})

test("short-lived token: remaining above 1 day min is not expiring soon", (t) => {
  // 10-day token, 20% = 2d threshold, remaining 5d → false
  const token = makeToken(-5, 5)
  t.false(isTokenExpiringSoon(token, NOW))
})

test("long-lived token: threshold clamped to 30 days maximum", (t) => {
  // 1-year token, 20% = 73d → clamped to 30d
  // remaining 25d → below 30d threshold → true
  const token = makeToken(-340, 25)
  t.true(isTokenExpiringSoon(token, NOW))
})

test("long-lived token: remaining above 30 day max is not expiring soon", (t) => {
  // 1-year token, clamped to 30d threshold, remaining 60d → false
  const token = makeToken(-305, 60)
  t.false(isTokenExpiringSoon(token, NOW))
})

test("mid-range token: 20% ratio applies", (t) => {
  // 50-day token → 20% = 10d threshold (within min/max bounds)
  // remaining 8d → true
  const token = makeToken(-42, 8)
  t.true(isTokenExpiringSoon(token, NOW))
})

test("mid-range token: remaining just above ratio threshold is not expiring", (t) => {
  // 50-day token → 10d threshold, remaining 12d → false
  const token = makeToken(-38, 12)
  t.false(isTokenExpiringSoon(token, NOW))
})

test("defaults to Date.now() when no reference time is given", (t) => {
  const token = {
    createdAt: new Date(Date.now() - 10 * DAY).toISOString(),
    expiresAt: new Date(Date.now() + 10 * DAY).toISOString(),
  }
  // 20-day total, 20% = 4d threshold, remaining ~10d → false
  t.false(isTokenExpiringSoon(token))
})
