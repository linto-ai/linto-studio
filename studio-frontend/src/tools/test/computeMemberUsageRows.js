import test from "ava"
import { computeMemberUsageRows } from "../computeMemberUsageRows.js"

const COLUMNS = [
  { capability: "import.minutes", key: "usage_import_minutes" },
  { capability: "ai.chat", key: "usage_ai_chat" },
]

const MEMBERS = [
  { _id: "u1", userId: "u1", firstname: "Ada" },
  { _id: "u2", userId: "u2", firstname: "Grace" },
]

test("puts each member's consumption on its row", (t) => {
  const rows = computeMemberUsageRows(
    MEMBERS,
    {
      u1: {
        "import.minutes": { used: 132.5, events: 12 },
        "ai.chat": { used: 41, events: 41 },
      },
    },
    COLUMNS,
  )
  t.is(rows[0].usage_import_minutes, 132.5)
  t.is(rows[0].usage_ai_chat, 41)
})

test("a member absent from the payload spent nothing", (t) => {
  const rows = computeMemberUsageRows(MEMBERS, {}, COLUMNS)
  t.is(rows[1].usage_import_minutes, 0)
  t.is(rows[1].usage_ai_chat, 0)
})

test("keeps the member fields untouched", (t) => {
  const rows = computeMemberUsageRows(MEMBERS, {}, COLUMNS)
  t.is(rows[0].firstname, "Ada")
  t.is(rows[0]._id, "u1")
})

test("falls back to the member id when there is no userId", (t) => {
  const rows = computeMemberUsageRows(
    [{ _id: "u3", firstname: "Alan" }],
    { u3: { "ai.chat": { used: 7 } } },
    COLUMNS,
  )
  t.is(rows[0].usage_ai_chat, 7)
})

test("no usage payload yet still yields rows", (t) => {
  const rows = computeMemberUsageRows(MEMBERS, null, COLUMNS)
  t.is(rows.length, 2)
  t.is(rows[0].usage_import_minutes, 0)
})
