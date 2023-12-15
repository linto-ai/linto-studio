import test from "ava"
import { findIndexSplit } from "../findIndexSplit.js"

test("get index when cut between two words", (t) => {
  t.deepEqual(findIndexSplit(["hello", "world", "nice", "day"], "hello"), 0)
})

test("get index when cut inside a word", (t) => {
  t.deepEqual(
    findIndexSplit(["hello", "world", "nice", "day"], "hello world ni"),
    2
  )
})

test("get index when cut first word", (t) => {
  t.deepEqual(findIndexSplit(["hello", "world", "nice", "day"], "hel"), 0)
})

test("get index when cut on last word", (t) => {
  t.deepEqual(
    findIndexSplit(["hello", "world", "nice", "day"], "hello world nice da"),
    3
  )
})

test("get index when some word contains spaces", (t) => {
  t.deepEqual(
    findIndexSplit(
      ["hello ?", "world", "nice day", "isn't", "it"],
      "hello ? world nice"
    ),
    2
  )
})

test("get index with empty words", (t) => {
  t.deepEqual(
    findIndexSplit(
      ["hello ?", "world", "", "nice day", "isn't", "it"],
      "hello ? world nice"
    ),
    3
  )
})
