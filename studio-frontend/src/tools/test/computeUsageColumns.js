import test from "ava"
import { computeUsageColumns } from "../computeUsageColumns.js"

const CAPABILITIES = {
  "import.minutes": { type: "quota", used: 120, limit: 12000, unit: "minutes" },
  "ai.generations": { type: "quota", used: 8, limit: 300, unit: "count" },
  "ai.chat": { type: "quota", used: 41, limit: 1000, unit: "count" },
  "api.calls": { type: "quota", used: 2, limit: 20000, unit: "count" },
  "live.minutes": { type: "credit", balance: 16 },
  collaboration: { type: "boolean", enabled: true },
}

test("keeps the member-facing quotas in display order", (t) => {
  const columns = computeUsageColumns(CAPABILITIES)
  t.deepEqual(
    columns.map((column) => column.capability),
    ["import.minutes", "ai.generations", "ai.chat"],
  )
})

test("flattens the column key so the table sorter can read it", (t) => {
  const columns = computeUsageColumns(CAPABILITIES)
  t.is(columns[0].key, "usage_import_minutes")
  t.is(columns[1].key, "usage_ai_generations")
})

test("carries the unit and the label key", (t) => {
  const [imports] = computeUsageColumns(CAPABILITIES)
  t.is(imports.unit, "minutes")
  t.is(imports.labelKey, "billing.meter.import")
})

test("leaves out credits, booleans and api calls", (t) => {
  const keys = computeUsageColumns(CAPABILITIES).map((c) => c.capability)
  t.false(keys.includes("live.minutes"))
  t.false(keys.includes("api.calls"))
  t.false(keys.includes("collaboration"))
})

test("a plan without metered capabilities has no column", (t) => {
  t.deepEqual(computeUsageColumns(null), [])
  t.deepEqual(computeUsageColumns({}), [])
})
