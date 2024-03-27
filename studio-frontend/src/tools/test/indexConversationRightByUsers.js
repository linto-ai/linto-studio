import test from "ava"

import { indexConversationRightByUsers } from "../indexConversationRightByUsers.js"

test("index conversation right by users", (t) => {
  const convs = [
    {
      conversationId: "id1",
      member: {
        external_members: [
          {
            _id: "user1",
            role: 0,
            right: 7,
            name: "name_1",
          },
          {
            _id: "user2",
            role: 0,
            right: 23,
            name: "name_2",
          },
        ],
        organization_members: [],
      },
    },
    {
      conversationId: "id1",
      member: {
        external_members: [
          {
            _id: "user1",
            role: 0,
            right: 7,
            name: "name_1",
          },
          {
            _id: "user2",
            role: 0,
            right: 15,
            name: "name_2",
          },
          {
            _id: "user3",
            role: 0,
            right: 23,
            name: "name_3",
          },
        ],
        organization_members: [],
      },
    },
  ]

  const res = indexConversationRightByUsers(convs)

  t.deepEqual(res, {
    external_members: new Map([
      [
        "user1",
        {
          _id: "user1",
          role: 0,
          right: 7,
          name: "name_1",
        },
      ],
      [
        "user2",
        {
          _id: "user2",
          role: 0,
          right: -1,
          name: "name_2",
        },
      ],
      // [
      //   "user3",
      //   {
      //     _id: "user3",
      //     role: 0,
      //     right: 23,
      //     name: "name_3",
      //   },
      // ],
    ]),
    organization_members: new Map(),
  })
})
