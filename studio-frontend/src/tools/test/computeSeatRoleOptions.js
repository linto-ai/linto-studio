import test from "ava"
import { computeSeatRoleOptions } from "../computeSeatRoleOptions.js"

const ROLES = [
  { value: 1, name: "Member" },
  { value: 2, name: "Contributor" },
  { value: 3, name: "Live contributor" },
  { value: 4, name: "Producer" },
  { value: 5, name: "Manager" },
  { value: 6, name: "Administrator" },
]

test("leaves out the free member role", (t) => {
  const options = computeSeatRoleOptions(ROLES, 6)
  t.deepEqual(
    options.map((role) => role.value),
    [2, 3, 4, 5, 6],
  )
})

test("caps the list at the viewer's own role", (t) => {
  const options = computeSeatRoleOptions(ROLES, 5)
  t.deepEqual(
    options.map((role) => role.value),
    [2, 3, 4, 5],
  )
})

test("no cap offers every seat role", (t) => {
  t.is(computeSeatRoleOptions(ROLES, null).length, 5)
})

test("a viewer below the first seat role is offered nothing", (t) => {
  t.deepEqual(computeSeatRoleOptions(ROLES, 1), [])
})

test("a missing role list is not an error", (t) => {
  t.deepEqual(computeSeatRoleOptions(undefined, 6), [])
})
