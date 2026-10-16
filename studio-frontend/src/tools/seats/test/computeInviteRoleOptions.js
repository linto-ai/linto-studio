import test from "ava"
import { computeInviteRoleOptions } from "../computeInviteRoleOptions.js"

const ROLES = [
  { value: 1, name: "Member" },
  { value: 2, name: "Contributor" },
  { value: 3, name: "Live contributor" },
  { value: 4, name: "Producer" },
  { value: 5, name: "Manager" },
  { value: 6, name: "Administrator" },
]

test("offers the member role then the seat roles up to the viewer's own", (t) => {
  t.deepEqual(computeInviteRoleOptions(ROLES, 3, true), [
    { value: 1, name: "Member", disabled: false },
    { value: 2, name: "Contributor", disabled: false },
    { value: 3, name: "Live contributor", disabled: false },
  ])
})

test("a full plan disables every seat role, never the member role", (t) => {
  const options = computeInviteRoleOptions(ROLES, 6, false)
  t.deepEqual(
    options.filter((role) => role.disabled).map((role) => role.value),
    [2, 3, 4, 5, 6],
  )
})

test("a member viewer can only invite members", (t) => {
  t.deepEqual(computeInviteRoleOptions(ROLES, 1, true), [
    { value: 1, name: "Member", disabled: false },
  ])
})
