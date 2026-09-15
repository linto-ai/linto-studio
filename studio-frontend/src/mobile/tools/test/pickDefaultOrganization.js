import test from "ava"
import { pickDefaultOrganization } from "../pickDefaultOrganization.js"

const organizations = [
  { _id: "team", personal: false, owner: "boss" },
  { _id: "mine", personal: true, owner: "me" },
  { _id: "other", personal: true, owner: "someone" },
]

test("pickDefaultOrganization() prefers the favorite, then the personal space", (t) => {
  t.is(pickDefaultOrganization(organizations, "me", "team"), "team")
  t.is(pickDefaultOrganization(organizations, "me", "gone"), "mine")
  t.is(pickDefaultOrganization(organizations, "me", null), "mine")
})

test("pickDefaultOrganization() falls back to the first organization", (t) => {
  t.is(pickDefaultOrganization([organizations[0]], "me", null), "team")
  t.is(pickDefaultOrganization([], "me", null), null)
})
