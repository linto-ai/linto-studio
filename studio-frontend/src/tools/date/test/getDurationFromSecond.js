import test from "ava"
import getDurationFromSecond from "../getDurationFromSecond.js"

test("getStartOfWeek", (t) => {
  // less than an hour, return 1h
  t.deepEqual(getDurationFromSecond(800), "1h")

  // 1 hour, return 1h
  t.deepEqual(getDurationFromSecond(3600), "1h")

  // 1 hour 30 minutes, return 2h
  t.deepEqual(getDurationFromSecond(5400), "2h")

  // 2 hour return 2h
  t.deepEqual(getDurationFromSecond(7200), "2h")

  // 1 day return 1d
  t.deepEqual(getDurationFromSecond(86400), "1d")

  // 2 days and 2 hour return 50h
  t.deepEqual(getDurationFromSecond(180000), "50h")

  // 3 days return 3d
  t.deepEqual(getDurationFromSecond(259200), "3d")

  // 1 year return 1y
  t.deepEqual(getDurationFromSecond(31536000), "1y")

  // 1 year and a day return 366d
  t.deepEqual(getDurationFromSecond(31622400), "366d")

  // 1 year and a day and one hour return 8785d
  t.deepEqual(getDurationFromSecond(31626000), "8785h")
})
