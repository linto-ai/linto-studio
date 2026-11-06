import test from "ava"
import { isSameItemList } from "../isSameItemList.js"

test("a rebuilt list of the same items is the same list", (t) => {
  t.true(
    isSameItemList(
      [{ id: "fr", name: "French" }, { id: "en" }],
      [{ id: "fr", name: "Français" }, { id: "en" }],
    ),
  )
})

test("compares items by value when they have no id", (t) => {
  t.true(
    isSameItemList([{ value: 1 }, { value: 2 }], [{ value: 1 }, { value: 2 }]),
  )
  t.false(isSameItemList([{ value: 1 }], [{ value: 2 }]))
})

test("an item added or removed makes another list", (t) => {
  t.false(isSameItemList([{ id: "fr" }], [{ id: "fr" }, { id: "en" }]))
})

test("the same items in another order make another list", (t) => {
  t.false(
    isSameItemList([{ id: "fr" }, { id: "en" }], [{ id: "en" }, { id: "fr" }]),
  )
})

test("a missing list is never the same", (t) => {
  t.false(isSameItemList(undefined, []))
  t.false(isSameItemList([], null))
})
