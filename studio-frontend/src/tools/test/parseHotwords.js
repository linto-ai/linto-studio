import test from "ava"
import { parseHotwords } from "../parseHotwords.js"

test("reads one word per line or between commas", (t) => {
  t.deepEqual(parseHotwords("LinTO\nLINAGORA, Twake"), [
    "LinTO",
    "LINAGORA",
    "Twake",
  ])
})

test("keeps a phrase whole", (t) => {
  t.deepEqual(parseHotwords("  Ada   Lovelace \n\n"), ["Ada Lovelace"])
})

test("drops duplicates whatever the case, keeping the first spelling", (t) => {
  t.deepEqual(parseHotwords("LinTO\nlinto\nLINTO"), ["LinTO"])
})

test("no text gives no word", (t) => {
  t.deepEqual(parseHotwords(""), [])
  t.deepEqual(parseHotwords(undefined), [])
})
