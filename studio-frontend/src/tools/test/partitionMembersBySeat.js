import test from "ava"
import { partitionMembersBySeat } from "../partitionMembersBySeat.js"

test("splits collaborators from free members", (t) => {
  const members = [
    { _id: "a", role: 1 },
    { _id: "b", role: 2 },
    { _id: "c", role: 6 },
  ]
  const { seated, free } = partitionMembersBySeat(members)
  t.deepEqual(
    seated.map((m) => m._id),
    ["b", "c"],
  )
  t.deepEqual(
    free.map((m) => m._id),
    ["a"],
  )
})

test("an empty list splits into two empty lists", (t) => {
  t.deepEqual(partitionMembersBySeat([]), { seated: [], free: [] })
})

test("a missing list is not an error", (t) => {
  t.deepEqual(partitionMembersBySeat(undefined), { seated: [], free: [] })
})

test("a member without a role is free", (t) => {
  const { seated, free } = partitionMembersBySeat([{ _id: "a" }])
  t.is(seated.length, 0)
  t.is(free.length, 1)
})
