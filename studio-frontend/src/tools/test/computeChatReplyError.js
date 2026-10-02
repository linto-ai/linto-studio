import test from "ava"
import { computeChatReplyError } from "../computeChatReplyError.js"

const ADMIN = { isAdmin: true }
const MEMBER = { isAdmin: false }

function keysOf(error) {
  return error.messages.map((m) => m.key)
}

function refusal(status, code, reason) {
  return { status, data: { code, reason } }
}

const QUOTA = refusal(402, "SAAS_QUOTA_EXCEEDED", "quota_exceeded")
const LOCKED = refusal(403, "SAAS_FEATURE_LOCKED", "feature_disabled")
const UNVERIFIED = refusal(403, "SAAS_FEATURE_LOCKED", "email_not_verified")

test("a stream error event reads as a failed reply, with no action", (t) => {
  const error = { status: null, data: { error: "LLM service error" } }
  t.deepEqual(computeChatReplyError(error, ADMIN), {
    titleKey: "chat.errors.reply_failed_title",
    messages: [{ key: "chat.errors.reply_failed" }],
    action: null,
  })
})

test("a network failure or a missing error read as a failed reply", (t) => {
  const network = { status: 0, data: { error: "Failed to fetch" } }
  t.is(
    computeChatReplyError(network, MEMBER).titleKey,
    "chat.errors.reply_failed_title",
  )
  t.is(
    computeChatReplyError(null, MEMBER).titleKey,
    "chat.errors.reply_failed_title",
  )
})

test("a spent quota is titled by the limit and offers the upgrade to an admin", (t) => {
  t.deepEqual(computeChatReplyError(QUOTA, ADMIN), {
    titleKey: "billing.limit_reached",
    messages: [{ key: "chat.errors.quota_exceeded_admin" }],
    action: "upgrade",
  })
})

test("a spent quota sends a member to an admin, with no action", (t) => {
  t.deepEqual(computeChatReplyError(QUOTA, MEMBER), {
    titleKey: "billing.limit_reached",
    messages: [{ key: "chat.errors.quota_exceeded_member" }],
    action: null,
  })
})

test("a chat outside the plan offers the upgrade to an admin", (t) => {
  const error = computeChatReplyError(LOCKED, ADMIN)
  t.deepEqual(keysOf(error), ["billing.refusal.not_available"])
  t.is(error.action, "upgrade")
})

test("an unverified email asks to verify it, never to upgrade", (t) => {
  for (const context of [ADMIN, MEMBER]) {
    const error = computeChatReplyError(UNVERIFIED, context)
    t.deepEqual(keysOf(error), ["billing.refusal.email_not_verified"])
    t.is(error.action, null)
  }
})
