import test from "ava"
import { listChildFolders } from "../listChildFolders.js"

const folders = [
  { _id: "b", name: "Beta", parentId: null },
  { _id: "a", name: "Alpha" },
  { _id: "a1", name: "Alpha child", parentId: "a" },
]

test("listChildFolders() returns top-level folders sorted by name", (t) => {
  t.deepEqual(
    listChildFolders(folders, null).map((f) => f._id),
    ["a", "b"],
  )
})

test("listChildFolders() returns the children of a folder", (t) => {
  t.deepEqual(
    listChildFolders(folders, "a").map((f) => f._id),
    ["a1"],
  )
  t.deepEqual(listChildFolders(folders, "b"), [])
})
