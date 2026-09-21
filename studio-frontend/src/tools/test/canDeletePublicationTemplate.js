import test from "ava"
import { canDeletePublicationTemplate } from "../canDeletePublicationTemplate.js"

const mine = { scope: "user", owner_user_id: "u1" }
const sharedByOther = { scope: "organization", owner_user_id: "u2" }
const personalOfOther = { scope: "user", owner_user_id: "u2" }

test("system templates can never be deleted", (t) => {
  t.false(canDeletePublicationTemplate({ scope: "system" }, "u1", true))
})

test("owner deletes their own template", (t) => {
  t.true(canDeletePublicationTemplate(mine, "u1", false))
})

test("manager deletes templates shared with the organization", (t) => {
  t.true(canDeletePublicationTemplate(sharedByOther, "u1", true))
  t.false(canDeletePublicationTemplate(sharedByOther, "u1", false))
})

test("manager cannot delete someone else's personal template", (t) => {
  t.false(canDeletePublicationTemplate(personalOfOther, "u1", true))
})
