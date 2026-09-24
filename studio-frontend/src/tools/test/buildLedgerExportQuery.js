import test from "ava"
import { buildLedgerExportQuery } from "../buildLedgerExportQuery.js"

test("passes the start day through and closes the end day, UTC", (t) => {
  t.deepEqual(
    buildLedgerExportQuery({ from: "2026-09-01", to: "2026-09-30" }),
    {
      from: "2026-09-01",
      to: "2026-09-30T23:59:59.999Z",
    },
  )
})

test("leaves out empty dates", (t) => {
  t.deepEqual(buildLedgerExportQuery({ from: "", to: " " }), {})
  t.deepEqual(buildLedgerExportQuery({ from: "2026-09-01" }), {
    from: "2026-09-01",
  })
})
