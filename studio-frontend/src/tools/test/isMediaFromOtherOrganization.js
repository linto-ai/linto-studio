import test from "ava"
import { isMediaFromOtherOrganization } from "../isMediaFromOtherOrganization.js"

test("media of the watched organization", (t) => {
  const media = { _id: "m1", organization: { organizationId: "orgA" } }
  t.false(isMediaFromOtherOrganization(media, "orgA"))
})

test("media of another organization", (t) => {
  const media = { _id: "m1", organization: { organizationId: "orgB" } }
  t.true(isMediaFromOtherOrganization(media, "orgA"))
})

test("media without organization is trusted", (t) => {
  t.false(isMediaFromOtherOrganization({ _id: "m1" }, "orgA"))
  t.false(isMediaFromOtherOrganization(undefined, "orgA"))
})
