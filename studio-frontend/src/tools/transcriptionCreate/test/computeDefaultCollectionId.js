import test from "ava"
import { computeDefaultCollectionId } from "../computeDefaultCollectionId.js"

test("prefers the organization-wide list", (t) => {
  t.is(
    computeDefaultCollectionId([
      { _id: "team", type: "user" },
      { _id: "org", type: "organization" },
    ]),
    "org",
  )
})

test("falls back to the first list, or none", (t) => {
  t.is(computeDefaultCollectionId([{ _id: "team", type: "user" }]), "team")
  t.is(computeDefaultCollectionId([]), null)
})
