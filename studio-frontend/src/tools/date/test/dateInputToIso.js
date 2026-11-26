import test from "ava"
import dateInputToIso from "../dateInputToIso.js"
import getFullDate from "../getFullDate.js"

test("gives the beginning of the day for the user", (t) => {
  const date = new Date(dateInputToIso("2027-05-24"))

  t.is(date.getFullYear(), 2027)
  t.is(date.getMonth(), 4)
  t.is(date.getDate(), 24)
  t.is(date.getHours(), 0)
  t.is(date.getMinutes(), 0)
})

test("comes back to the same day in a date input", (t) => {
  for (const day of ["2027-01-01", "2027-03-28", "2027-10-31", "2028-02-29"]) {
    t.is(getFullDate(new Date(dateInputToIso(day))), day)
  }
})

test("an empty input gives no date", (t) => {
  t.is(dateInputToIso(""), null)
  t.is(dateInputToIso(null), null)
  t.is(dateInputToIso(undefined), null)
})
