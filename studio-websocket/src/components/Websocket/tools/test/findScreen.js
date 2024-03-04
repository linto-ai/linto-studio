import test from "ava"
import findScreen from "../findScreen.js"

let arr = [
  { screen_id: "0" },
  { screen_id: "1" },
  { screen_id: "2" },
  { screen_id: "3" },
  { screen_id: "4" },
]

test("findScreen middle", (t) => {
  t.is(findScreen(arr, "2"), arr[2])
})

test("findScreen first", (t) => {
  t.is(findScreen(arr, "0"), arr[0])
})

test("findScreen last", (t) => {
  t.is(findScreen(arr, "4"), arr[4])
})

test("findScreen invalid id", (t) => {
  t.is(findScreen(arr, "invalid"), null)
})

test("findScreen emptyArray", (t) => {
  t.is(findScreen([], "0"), null)
})
