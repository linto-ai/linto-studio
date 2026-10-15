import test from "ava"
import { findReportIdByFormat } from "../findReportIdByFormat.js"

const catalog = new Map([
  ["cr", { format: "cr-format" }],
  ["summary", { format: "summary" }],
])

test("findReportIdByFormat() matches the service format", (t) => {
  t.is(findReportIdByFormat(catalog, { serviceFormat: "cr-format" }), "cr")
})

test("findReportIdByFormat() matches the report id", (t) => {
  t.is(findReportIdByFormat(catalog, { format: "cr" }), "cr")
})

test("findReportIdByFormat() reads the service name too", (t) => {
  t.is(findReportIdByFormat(catalog, { serviceName: "summary" }), "summary")
})

test("findReportIdByFormat() is null without a match or a format", (t) => {
  t.is(findReportIdByFormat(catalog, { format: "other" }), null)
  t.is(findReportIdByFormat(catalog, {}), null)
})
