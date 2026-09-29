import test from "ava"
import { canShareConversation } from "../canShareConversation.js"

const MEMBER = 1
const MAINTAINER = 5
const conversation = {
  organization: {
    membersRight: 1,
    customRights: [{ userId: "u2", right: 31 }],
  },
}

test("canShareConversation() lets maintainers share any conversation", (t) => {
  t.true(canShareConversation(conversation, "u1", MAINTAINER))
})

test("canShareConversation() needs the delete right otherwise", (t) => {
  t.false(canShareConversation(conversation, "u1", MEMBER))
  t.true(canShareConversation(conversation, "u2", MEMBER))
  t.true(
    canShareConversation(
      { ...conversation, userAccess: { right: 31 } },
      "u1",
      MEMBER,
    ),
  )
})

test("canShareConversation() is false without a conversation or rights block", (t) => {
  t.false(canShareConversation(null, "u1", MEMBER))
  t.false(canShareConversation({ organization: {} }, "u1", MEMBER))
})
