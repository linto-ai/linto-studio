import test from "ava"
import { findReportIdByJobId } from "../findReportIdByJobId.js"

const jobs = new Map([
  ["cr", { jobId: "j1" }],
  ["summary", { jobId: null }],
])

test("findReportIdByJobId() finds the report of a job", (t) => {
  t.is(findReportIdByJobId(jobs, "j1"), "cr")
})

test("findReportIdByJobId() is null for an unknown job", (t) => {
  t.is(findReportIdByJobId(jobs, "j9"), null)
})

test("findReportIdByJobId() never matches a missing job id", (t) => {
  t.is(findReportIdByJobId(jobs, null), null)
  t.is(findReportIdByJobId(jobs, undefined), null)
})
