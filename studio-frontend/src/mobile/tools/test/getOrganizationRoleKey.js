import test from "ava"
import { getOrganizationRoleKey } from "../getOrganizationRoleKey.js"

test("getOrganizationRoleKey() maps every known role", (t) => {
  t.is(getOrganizationRoleKey(1), "member")
  t.is(getOrganizationRoleKey(2), "uploader")
  t.is(getOrganizationRoleKey(3), "quick_meeting")
  t.is(getOrganizationRoleKey(4), "session_operator")
  t.is(getOrganizationRoleKey(5), "maintainer")
  t.is(getOrganizationRoleKey(6), "administrator")
})

test("getOrganizationRoleKey() falls back to member for unknown roles", (t) => {
  t.is(getOrganizationRoleKey(0), "member")
  t.is(getOrganizationRoleKey(42), "member")
  t.is(getOrganizationRoleKey(undefined), "member")
})
