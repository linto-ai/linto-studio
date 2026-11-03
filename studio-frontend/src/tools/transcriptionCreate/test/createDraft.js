import test from "ava"
import { createDraft } from "../createDraft.js"

test("starts on detection, both timings and no translation", (t) => {
  const draft = createDraft({ source: "microphone", securityLevel: 1 })
  t.is(draft.source, "microphone")
  t.is(draft.securityLevel, 1)
  t.is(draft.timing, "both")
  t.deepEqual(draft.languages, ["*"])
  t.deepEqual(draft.translations, [])
})
