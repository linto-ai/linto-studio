import test from "ava"
import { describeSearchResults } from "../describeSearchResults.js"

const context = {
  roleById: new Map([
    ["admin", 6],
    ["maintainer", 5],
    ["member", 1],
  ]),
  sharedById: new Map([["guest", { _id: "guest", right: 3 }]]),
  defaultRight: 1,
  privilegedRole: 5,
  adminRole: 6,
}
const results = [
  { _id: "admin" },
  { _id: "maintainer" },
  { _id: "member" },
  { _id: "guest" },
  { _id: "nobody" },
]

test("describeSearchResults() gives each user the right in force", (t) => {
  const described = describeSearchResults(results, context)
  t.deepEqual(
    described.map((u) => [u._id, u.right, u.inOrganization, u.privileged]),
    [
      ["admin", 31, true, true],
      ["maintainer", 23, true, true],
      ["member", 1, true, false],
      ["guest", 3, false, false],
      ["nobody", 0, false, false],
    ],
  )
})
