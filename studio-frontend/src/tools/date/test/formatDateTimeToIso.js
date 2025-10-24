import test from "ava"
import formatDateTimeToIso from "../formatDateTimeToIso.js"

test("formatDateTimeToIso", (t) => {
  const date = new Date("2024-10-07:13:12")
  t.deepEqual(formatDateTimeToIso(date), "2024-10-07T13:12:00.000")
})
