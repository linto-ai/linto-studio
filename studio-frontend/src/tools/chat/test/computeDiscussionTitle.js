import test from "ava"
import { computeDiscussionTitle } from "../computeDiscussionTitle.js"

test("computeDiscussionTitle() keeps a short message", (t) => {
  t.is(computeDiscussionTitle("  Quel budget ?  "), "Quel budget ?")
})

test("computeDiscussionTitle() cuts a long message short", (t) => {
  t.is(
    computeDiscussionTitle("Quelles décisions ont été prises sur le budget ?"),
    "Quelles décisions ont été pris...",
  )
})

test("computeDiscussionTitle() does not end on a space before the dots", (t) => {
  t.is(computeDiscussionTitle("abc def ghi", 8), "abc def...")
})
