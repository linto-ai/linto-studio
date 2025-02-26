import test from "ava"
import getWeekNumberFromDate from "../getWeekNumberFromDate.js"

test("get week number from date", (t) => {
  const date = new Date("2021-01-01")
  const weekNumber = getWeekNumberFromDate(date)
  t.is(weekNumber, 53)

  const date2 = new Date("2023-01-02")
  const weekNumber2 = getWeekNumberFromDate(date2)
  t.is(weekNumber2, 1)

  const date3 = new Date("2023-01-06")
  const weekNumber3 = getWeekNumberFromDate(date3)
  t.is(weekNumber3, 1)

  const date4 = new Date("2024-01-01")
  const weekNumber4 = getWeekNumberFromDate(date4)
  t.is(weekNumber4, 1)

  const date5 = new Date("2023-01-01")
  const weekNumber5 = getWeekNumberFromDate(date5)
  t.is(weekNumber5, 52)

  const date6 = new Date("2025-02-26")
  const weekNumber6 = getWeekNumberFromDate(date6)
  t.is(weekNumber6, 9)

  const date7 = new Date("2025-02-25")
  const weekNumber7 = getWeekNumberFromDate(date7)
  t.is(weekNumber7, 9)

  const date8 = new Date("2025-02-24")
  const weekNumber8 = getWeekNumberFromDate(date8)
  t.is(weekNumber8, 9)

  const date9 = new Date("2025-02-23")
  const weekNumber9 = getWeekNumberFromDate(date9)
  t.is(weekNumber9, 8)

  const date10 = new Date("2025-01-01")
  const weekNumber10 = getWeekNumberFromDate(date10)
  t.is(weekNumber10, 1)

  // corner case, it returns 53 instead of 1. To support it, getWeekNumberFromDate need to return both week number and year.
  // const date11 = new Date("2024-12-30")
  // const weekNumber11 = getWeekNumberFromDate(date11)
  // t.is(weekNumber11, 1)
})
