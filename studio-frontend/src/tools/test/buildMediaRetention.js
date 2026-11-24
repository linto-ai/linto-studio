import test from "ava"
import { buildMediaRetention } from "../buildMediaRetention.js"

test("builds the retention from the form values", (t) => {
  t.deepEqual(buildMediaRetention("6", "month"), { value: 6, unit: "month" })
  t.deepEqual(buildMediaRetention(2, "year"), { value: 2, unit: "year" })
})

test("ignores the spaces around the duration", (t) => {
  t.deepEqual(buildMediaRetention(" 12 ", "month"), {
    value: 12,
    unit: "month",
  })
})

test("an empty duration means no retention", (t) => {
  t.is(buildMediaRetention("", "month"), null)
  t.is(buildMediaRetention("  ", "year"), null)
  t.is(buildMediaRetention(null, "month"), null)
  t.is(buildMediaRetention(undefined, "month"), null)
})
