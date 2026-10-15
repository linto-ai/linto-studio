import test from "ava"
import { computeCanGenerateReports } from "../computeCanGenerateReports.js"

const permissions = { edit: false, forceGenerate: false }

test("computeCanGenerateReports() follows the summary capability", (t) => {
  t.true(
    computeCanGenerateReports({ summary: { ...permissions, generate: true } }),
  )
  t.false(
    computeCanGenerateReports({ summary: { ...permissions, generate: false } }),
  )
})

test("computeCanGenerateReports() allows it when the host sets nothing", (t) => {
  t.true(computeCanGenerateReports({ text: "edit", speakers: "edit" }))
})
