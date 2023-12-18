import test from "ava"
import { calculCursorPos } from "../calculCursorPos.js"

// TEST = "BONJOUR"

test("change after cursor index", (t) => {
  let delta = [{ retain: 7 }, { insert: "a" }]
  t.is(calculCursorPos(4, delta), 4)
})

test("insert before cursor index", (t) => {
  let delta = [{ insert: "coucou" }, { retain: 7 }]
  t.is(calculCursorPos(4, delta), 10)
})

test("Delete before cursor index", (t) => {
  let delta = [{ delete: 2 }, { retain: 5 }]
  t.is(calculCursorPos(4, delta), 2)
})

test("Delete after cursor index", (t) => {
  let delta = [{ retain: 5 }, { delete: 2 }]
  t.is(calculCursorPos(4, delta), 4)
})

test("Delete before cursor index + insert juste after cursor", (t) => {
  let delta = [
    { retain: 1 },
    { delete: 2 },
    { retain: 1 },
    { insert: "a" },
    { retain: 3 },
  ]
  t.is(calculCursorPos(3, delta), 1)
})

test("delete 2 char: 1before cursor, 1after cursor", (t) => {
  let delta = [{ retain: 2 }, { delete: 2 }, { retain: 3 }]
  t.is(calculCursorPos(3, delta), 2)
})

test("Delete ALL and add new content", (t) => {
  let delta = [{ delete: 7 }, { insert: "salut" }]
  t.is(calculCursorPos(3, delta), 0)
})

test("cursor last position and delete last character", (t) => {
  let delta = [{ retain: 6 }, { delete: 1 }]
  t.is(calculCursorPos(7, delta), 6)
})
