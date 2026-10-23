import test from "ava"
import { computeNextSort } from "../computeNextSort.js"

test("a new column starts descending", (t) => {
  t.deepEqual(computeNextSort({ key: "user", direction: "asc" }, "role"), {
    key: "role",
    direction: "desc",
  })
})

test("the sorted column flips from descending to ascending", (t) => {
  t.deepEqual(computeNextSort({ key: "user", direction: "desc" }, "user"), {
    key: "user",
    direction: "asc",
  })
})

test("the sorted column flips from ascending to descending", (t) => {
  t.deepEqual(computeNextSort({ key: "user", direction: "asc" }, "user"), {
    key: "user",
    direction: "desc",
  })
})
