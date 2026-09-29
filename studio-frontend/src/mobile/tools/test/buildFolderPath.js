import test from "ava"
import { buildFolderPath } from "../buildFolderPath.js"

const folders = [
  { _id: "a", name: "Alpha" },
  { _id: "a1", name: "Child", parentId: "a" },
  { _id: "a11", name: "Grandchild", parentId: "a1" },
]

test("buildFolderPath() lists ancestors root first", (t) => {
  t.deepEqual(
    buildFolderPath(folders, "a11").map((f) => f._id),
    ["a", "a1", "a11"],
  )
  t.deepEqual(
    buildFolderPath(folders, "a").map((f) => f._id),
    ["a"],
  )
})

test("buildFolderPath() is empty at the top level or for an unknown folder", (t) => {
  t.deepEqual(buildFolderPath(folders, null), [])
  t.deepEqual(buildFolderPath(folders, "nope"), [])
})

test("buildFolderPath() survives a parent cycle", (t) => {
  const cyclic = [
    { _id: "x", name: "X", parentId: "y" },
    { _id: "y", name: "Y", parentId: "x" },
  ]
  t.true(buildFolderPath(cyclic, "x").length <= 20)
})
