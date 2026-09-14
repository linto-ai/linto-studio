import test from "ava"
import { listUserOrganizations } from "../listUserOrganizations.js"

const organizations = [
  { _id: "a", name: "ACME", owner: "u1", users: [] },
  { _id: "b", name: "Beta", owner: "u9", users: [{ userId: "u1", role: 2 }] },
  { _id: "c", name: "u1 personal", owner: "u1", personal: true, users: [] },
]

test("listUserOrganizations() adds a display name and the user's role", (t) => {
  const list = listUserOrganizations(organizations, "u1", "Mon espace")
  t.is(list[0].displayName, "ACME")
  t.is(list[0].role, 6)
  t.is(list[1].role, 2)
  t.is(list[2].displayName, "Mon espace")
})

test("listUserOrganizations() keeps the original fields", (t) => {
  t.is(listUserOrganizations(organizations, "u1", "x")[1]._id, "b")
  t.deepEqual(listUserOrganizations([], "u1", "x"), [])
})
