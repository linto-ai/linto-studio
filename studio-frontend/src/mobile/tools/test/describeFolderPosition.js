import test from "ava"
import { describeFolderPosition } from "../describeFolderPosition.js"

const folders = [
  { _id: "a", name: "Alpha", parentId: null },
  { _id: "b", name: "Beta", parentId: null },
  { _id: "a1", name: "Alpha 1", parentId: "a" },
  { _id: "a1x", name: "Deep", parentId: "a1" },
]

test("describeFolderPosition() at the top level", (t) => {
  const position = describeFolderPosition(folders, null)
  t.is(position.current, null)
  t.is(position.parent, undefined)
  t.deepEqual(
    position.subfolders.map((f) => [f._id, f.childCount]),
    [
      ["a", 1],
      ["b", 0],
    ],
  )
})

test("describeFolderPosition() inside a folder", (t) => {
  const position = describeFolderPosition(folders, "a1")
  t.is(position.current.name, "Alpha 1")
  t.is(position.parent._id, "a")
  t.deepEqual(
    position.subfolders.map((f) => f._id),
    ["a1x"],
  )
  t.is(describeFolderPosition(folders, "a").parent, null)
})

test("describeFolderPosition() with an unknown folder id", (t) => {
  const position = describeFolderPosition(folders, "gone")
  t.is(position.current, null)
  t.is(position.parent, null)
  t.deepEqual(position.subfolders, [])
})
