import test from "ava"
import { splitOrganizationMembers } from "../splitOrganizationMembers.js"

const members = [
  { _id: "admin", right: 31 },
  { _id: "reader", right: 1 },
  { _id: "writer", right: 7 },
  { _id: "left", right: 1 },
]
const roles = new Map([
  ["admin", 6],
  ["reader", 1],
  ["writer", 2],
])

test("splitOrganizationMembers() sorts members by role and right", (t) => {
  const split = splitOrganizationMembers(members, roles, 1, 5)
  t.deepEqual(
    split.privileged.map((m) => m._id),
    ["admin"],
  )
  t.deepEqual(
    split.exceptions.map((m) => m._id),
    ["writer"],
  )
  t.deepEqual(
    split.regular.map((m) => [m._id, m.role]),
    [
      ["reader", 1],
      ["left", null],
    ],
  )
})

test("splitOrganizationMembers() follows the default right", (t) => {
  const split = splitOrganizationMembers(members, roles, 7, 5)
  t.deepEqual(
    split.exceptions.map((m) => m._id),
    ["reader", "left"],
  )
})
