import test from "ava"
import findScreenIndex from "../findScreenIndex.js"

let arr = [
  { screen_id: "0" },
  { screen_id: "1" },
  { screen_id: "2" },
  { screen_id: "3" },
  { screen_id: "4" },
]

test("findScreen middle", (t) => {
  t.is(findScreenIndex(arr, "2"), 2)
})

test("findScreen first", (t) => {
  t.is(findScreenIndex(arr, "0"), 0)
})

test("findScreen last", (t) => {
  t.is(findScreenIndex(arr, "4"), 4)
})

test("findScreen invalid id", (t) => {
  t.is(findScreenIndex(arr, "invalid"), -1)
})

test("findScreen emptyArray", (t) => {
  t.is(findScreenIndex([], "0"), -1)
})
