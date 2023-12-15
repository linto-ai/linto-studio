import test from "ava"

import { indexOrganizationsRoles } from "../indexOrganizationsRoles.js"

test("index organization by _id and index their users", (t) => {
  const orgas = [
    {
      _id: "6511afa35c55297c11145bc1",
      owner: "6511afa35c55297c11145bc0",
      name: "First organization",
      users: [
        { userId: "6511afa35c55297c11145bc0", role: 4 },
        { userId: "65128aa25ab7580be1709f78", role: 1 },
      ],
    },
    {
      _id: "6512b65f5ab7580be1709f80",
      name: "Another one",
      description: "",
      users: [{ userId: "6511afa35c55297c11145bc0", role: 2 }],
      owner: "6511afa35c55297c11145bc0",
    },
  ]

  const res = indexOrganizationsRoles(orgas, "6511afa35c55297c11145bc0")

  t.deepEqual(
    res,
    new Map([
      [
        "6511afa35c55297c11145bc1",
        {
          name: "First organization",
          myrole: 4,
          users: new Map([
            [
              "6511afa35c55297c11145bc0",
              { role: 4, _id: "6511afa35c55297c11145bc0" },
            ],
            [
              "65128aa25ab7580be1709f78",
              { role: 1, _id: "65128aa25ab7580be1709f78" },
            ],
          ]),
        },
      ],
      [
        "6512b65f5ab7580be1709f80",
        {
          name: "Another one",
          myrole: 2,
          users: new Map([
            [
              "6511afa35c55297c11145bc0",
              { role: 2, _id: "6511afa35c55297c11145bc0" },
            ],
          ]),
        },
      ],
    ])
  )
})
