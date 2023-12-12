import test from "ava"
import { getUserRightFromConversation } from "../getUserRightFromConversation.js"

test("get user custom right from conversation", (t) => {
  const conv = {
    organization: {
      organizationId: "63525d431f7639bf4deee86f",
      membersRight: 1,
      customRights: [
        {
          userId: "63564b251f7639bf4deee876",
          right: 7,
          sharedBy: "63525d431f7639bf4deee86e",
        },
      ],
    },
    _id: "6492c5bcb02e450c2952635e",
  }

  const userId = "63564b251f7639bf4deee876"

  const right = getUserRightFromConversation(conv, userId)

  t.deepEqual(right, 7)
})

test("get user default right from conversation", (t) => {
  const conv = {
    organization: {
      organizationId: "63525d431f7639bf4deee86f",
      membersRight: 1,
      customRights: [
        {
          userId: "63564b251f7639bf4deee876",
          right: 7,
          sharedBy: "63525d431f7639bf4deee86e",
        },
      ],
    },
    _id: "6492c5bcb02e450c2952635e",
  }

  const userId = "63564b251f7639bf4dabc876"

  const right = getUserRightFromConversation(conv, userId)

  t.deepEqual(right, 1)
})

test("get user right from share", (t) => {
  const conv = {
    organization: {
      organizationId: "63525d431f7639bf4deee86f",
      membersRight: 1,
      customRights: [
        {
          userId: "63564b251f7639bf4deee876",
          right: 7,
          sharedBy: "63525d431f7639bf4deee86e",
        },
      ],
    },
    customRights: [
      {
        userId: "63564b251f7639bf4dabc876",
        right: 5,
        sharedBy: "63525d431f7639bf4deee86e",
      },
    ],
    _id: "6492c5bcb02e450c2952635e",
  }

  const userId = "63564b251f7639bf4dabc876"

  const right = getUserRightFromConversation(conv, userId)

  t.deepEqual(right, 5)
})
