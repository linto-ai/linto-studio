import test from "ava"
import { isOwnPersonalOrganization } from "../isOwnPersonalOrganization.js"

test("isOwnPersonalOrganization() is true for the user's own personal organization", (t) => {
  t.true(isOwnPersonalOrganization({ personal: true, owner: "u1" }, "u1"))
})

test("isOwnPersonalOrganization() is false for someone else's personal organization", (t) => {
  t.false(isOwnPersonalOrganization({ personal: true, owner: "u2" }, "u1"))
})

test("isOwnPersonalOrganization() is false for a team organization", (t) => {
  t.false(isOwnPersonalOrganization({ personal: false, owner: "u1" }, "u1"))
})

test("isOwnPersonalOrganization() is false without an organization", (t) => {
  t.false(isOwnPersonalOrganization(undefined, "u1"))
})
