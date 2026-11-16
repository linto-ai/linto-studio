import test from "ava"
import { countStalledReports } from "../countStalledReports.js"

const REPORT = { count: 0, previousSize: 1000, sizeBytes: 1000, paused: false }

test("countStalledReports() counts a file that stopped growing", (t) => {
  t.is(countStalledReports(REPORT), 1)
  t.is(countStalledReports({ ...REPORT, count: 1, sizeBytes: 900 }), 2)
})

test("countStalledReports() resets once the file grows", (t) => {
  t.is(countStalledReports({ ...REPORT, count: 1, sizeBytes: 5000 }), 0)
})

test("countStalledReports() resets during a pause", (t) => {
  t.is(countStalledReports({ ...REPORT, count: 1, paused: true }), 0)
})

test("countStalledReports() resets without a size to compare", (t) => {
  t.is(countStalledReports({ ...REPORT, count: 1, previousSize: null }), 0)
  t.is(countStalledReports({ ...REPORT, count: 1, sizeBytes: null }), 0)
})
