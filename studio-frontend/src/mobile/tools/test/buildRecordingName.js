import test from "ava"
import { buildRecordingName } from "../buildRecordingName.js"

const date = new Date(2026, 8, 14, 10, 32)

test("buildRecordingName() formats a French name with the given prefix", (t) => {
  const name = buildRecordingName(date, "fr-FR", "Enregistrement")
  t.true(name.startsWith("Enregistrement 14 sept. 2026"))
  t.true(name.endsWith("10:32"))
})

test("buildRecordingName() formats an English name", (t) => {
  const name = buildRecordingName(date, "en-US", "Recording")
  t.true(name.startsWith("Recording Sep 14, 2026"))
  t.true(name.includes("10:32"))
})
