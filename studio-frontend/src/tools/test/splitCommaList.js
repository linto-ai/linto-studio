import test from "ava"
import { splitCommaList } from "../splitCommaList.js"

test("splits on commas and spaces, trims, deduplicates", (t) => {
  t.deepEqual(splitCommaList(" a, b,,c a "), ["a", "b", "c"])
})

test("accepts an array and ignores other types", (t) => {
  t.deepEqual(splitCommaList([" a ", "b", ""]), ["a", "b"])
  t.deepEqual(splitCommaList(undefined), [])
  t.deepEqual(splitCommaList(12), [])
})
