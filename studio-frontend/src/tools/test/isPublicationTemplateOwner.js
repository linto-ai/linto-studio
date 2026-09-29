import test from "ava"
import { isPublicationTemplateOwner } from "../isPublicationTemplateOwner.js"

test("owner_user_id matches the user", (t) => {
  t.true(isPublicationTemplateOwner({ owner_user_id: "u1" }, "u1"))
  t.false(isPublicationTemplateOwner({ owner_user_id: "u2" }, "u1"))
})

test("legacy user_id is used when owner_user_id is missing", (t) => {
  t.true(isPublicationTemplateOwner({ user_id: "u1" }, "u1"))
})

test("templates without owner belong to nobody", (t) => {
  t.false(isPublicationTemplateOwner({ scope: "system" }, "u1"))
  t.false(isPublicationTemplateOwner({ owner_user_id: null }, undefined))
})
