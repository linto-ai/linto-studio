import test from "ava"
import * as Y from "yjs"
import { applyDeltaOnYArray } from "../applyDeltaOnYArray.js"

test("add element", (t) => {
  const ydoc = new Y.Doc()
  const yarray = ydoc.getArray("test")
  yarray.insert(0, ["a", "b", "c"])

  const delta = [{ retain: 1 }, { insert: ["bc"] }, { retain: 1 }]

  applyDeltaOnYArray(yarray, delta)

  t.deepEqual(yarray.toArray(), ["a", "bc", "b", "c"])
})

test("edit element", (t) => {
  const ydoc = new Y.Doc()
  const yarray = ydoc.getArray("test")
  yarray.insert(0, ["a", "b", "c"])

  const delta = [
    { retain: 1 },
    { delete: 1 },
    { insert: ["new b"] },
    { retain: 1 },
  ]

  applyDeltaOnYArray(yarray, delta)

  t.deepEqual(yarray.toArray(), ["a", "new b", "c"])
})

test("delete two and add one", (t) => {
  const ydoc = new Y.Doc()
  const yarray = ydoc.getArray("test")
  yarray.insert(0, ["a", "b", "c"])

  const delta = [{ retain: 1 }, { delete: 2 }, { insert: ["new b", "new c"] }]

  applyDeltaOnYArray(yarray, delta)

  t.deepEqual(yarray.toArray(), ["a", "new b", "new c"])
})

test("add element at end", (t) => {
  const ydoc = new Y.Doc()
  const yarray = ydoc.getArray("test")
  yarray.insert(0, ["a", "b", "c"])

  const delta = [{ retain: 3 }, { insert: ["d"] }]

  applyDeltaOnYArray(yarray, delta)

  t.deepEqual(yarray.toArray(), ["a", "b", "c", "d"])
})

test("add two element", (t) => {
  const ydoc = new Y.Doc()
  const yarray = ydoc.getArray("test")
  yarray.insert(0, ["a", "b", "c"])

  const delta = [
    { retain: 2 },
    { insert: ["b1", "b2"] },
    { delete: 1 },
    { insert: ["b3"] },
  ]

  applyDeltaOnYArray(yarray, delta)

  t.deepEqual(yarray.toArray(), ["a", "b", "b1", "b2", "b3"])
})
