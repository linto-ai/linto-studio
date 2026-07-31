import test from "ava"
import { computeScreenWords } from "../computeScreenWords.js"

test("spreads word timings linearly over the screen window", (t) => {
  const words = computeScreenWords(["hello brave", "world"], 10, 13)

  t.is(words.length, 3)
  t.deepEqual(
    words.map((w) => w.word),
    ["hello", "brave", "world"],
  )
  t.is(words[0].stime, 10)
  t.is(words[0].etime, 11)
  t.is(words[1].stime, 11)
  t.is(words[2].etime, 13)
})

test("ignores empty lines and extra spaces", (t) => {
  const words = computeScreenWords(["", "  one   two "], 0, 1)

  t.deepEqual(
    words.map((w) => w.word),
    ["one", "two"],
  )
})

test("returns an empty list for empty text", (t) => {
  t.deepEqual(computeScreenWords([], 0, 1), [])
  t.deepEqual(computeScreenWords([""], 0, 1), [])
})

test("every word carries the screen schema fields", (t) => {
  const [word] = computeScreenWords(["word"], 2, 4)

  t.truthy(word.wid)
  t.is(word.confidence, 1)
  t.is(word.stime, 2)
  t.is(word.etime, 4)
})
