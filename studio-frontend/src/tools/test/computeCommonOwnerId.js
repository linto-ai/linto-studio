import test from "ava"
import { computeCommonOwnerId } from "../computeCommonOwnerId.js"

test("returns null for an empty list", (t) => {
  t.is(computeCommonOwnerId([]), null)
})

test("returns the owner of a single conversation", (t) => {
  t.is(computeCommonOwnerId([{ owner: "a" }]), "a")
})

test("returns the owner shared by every conversation", (t) => {
  t.is(computeCommonOwnerId([{ owner: "a" }, { owner: "a" }]), "a")
})

test("returns null when owners differ", (t) => {
  t.is(computeCommonOwnerId([{ owner: "a" }, { owner: "b" }]), null)
})

test("returns null when no conversation has an owner", (t) => {
  t.is(computeCommonOwnerId([{}, {}]), null)
})
