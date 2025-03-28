import test from "ava"
import getDayListFromWeekNumber from "../getDayListFromWeekNumber.js"
test("get day list from week number", (t) => {
  const dayList = getDayListFromWeekNumber(1, 2021)
  t.deepEqual(dayList, [
    new Date("2021-01-04"),
    new Date("2021-01-05"),
    new Date("2021-01-06"),
    new Date("2021-01-07"),
    new Date("2021-01-08"),
    new Date("2021-01-09"),
    new Date("2021-01-10"),
  ])

  const dayList2025 = getDayListFromWeekNumber(1, 2025)
  t.deepEqual(dayList2025, [
    new Date("2024-12-30"),
    new Date("2024-12-31"),
    new Date("2025-01-01"),
    new Date("2025-01-02"),
    new Date("2025-01-03"),
    new Date("2025-01-04"),
    new Date("2025-01-05"),
  ])
})
