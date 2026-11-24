import test from "ava"
import { testMediaRetentionValue } from "../testMediaRetentionValue.js"

function check(value) {
  const field = { value, error: null, valid: false }
  const valid = testMediaRetentionValue(field, (key) => key)
  return { valid, field }
}

test("accepts a whole number from 1 to 120", (t) => {
  for (const value of ["1", "6", "120", 12, " 24 "]) {
    const { valid, field } = check(value)
    t.true(valid, `value ${value}`)
    t.is(field.error, null)
  }
})

test("accepts an empty value: no retention", (t) => {
  for (const value of ["", "  ", null, undefined]) {
    t.true(check(value).valid)
  }
})

test("refuses anything else with an error on the field", (t) => {
  for (const value of ["0", "121", "-3", "1.5", "six", "1e2"]) {
    const { valid, field } = check(value)
    t.false(valid, `value ${value}`)
    t.is(field.error, "organisation.media_retention.value_error")
  }
})

test("clears a previous error once the value is valid", (t) => {
  const field = { value: "6", error: "previous", valid: false }

  testMediaRetentionValue(field, (key) => key)

  t.is(field.error, null)
  t.true(field.valid)
})
