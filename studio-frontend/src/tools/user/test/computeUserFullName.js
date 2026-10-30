import test from "ava"
import { computeUserFullName } from "../computeUserFullName.js"

test("computeUserFullName() joins first and last name", (t) => {
  t.is(computeUserFullName({ firstname: "John", lastname: "Doe" }), "John Doe")
})

test("computeUserFullName() keeps the only part filled in", (t) => {
  t.is(computeUserFullName({ firstname: "John" }), "John")
  t.is(computeUserFullName({ lastname: "Doe" }), "Doe")
})

test("computeUserFullName() ignores blank parts", (t) => {
  t.is(computeUserFullName({ firstname: "  ", lastname: "Doe" }), "Doe")
})

test("computeUserFullName() returns an empty string without any name", (t) => {
  t.is(computeUserFullName({ email: "lolo@example.com" }), "")
  t.is(computeUserFullName({ firstname: null, lastname: "" }), "")
  t.is(computeUserFullName(null), "")
})
