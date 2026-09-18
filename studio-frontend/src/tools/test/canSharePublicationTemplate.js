import test from "ava"
import { canSharePublicationTemplate } from "../canSharePublicationTemplate.js"

test("manager shares their own template", (t) => {
  t.true(
    canSharePublicationTemplate(
      { scope: "user", owner_user_id: "u1" },
      "u1",
      true,
    ),
  )
  t.true(
    canSharePublicationTemplate(
      { scope: "organization", owner_user_id: "u1" },
      "u1",
      true,
    ),
  )
})

test("plain member cannot share", (t) => {
  t.false(
    canSharePublicationTemplate(
      { scope: "user", owner_user_id: "u1" },
      "u1",
      false,
    ),
  )
})

test("manager cannot share someone else's template", (t) => {
  t.false(
    canSharePublicationTemplate(
      { scope: "user", owner_user_id: "u2" },
      "u1",
      true,
    ),
  )
})

test("system templates are not shareable", (t) => {
  t.false(canSharePublicationTemplate({ scope: "system" }, "u1", true))
})
