import test from "ava"
import { computePackKindLabelKey } from "../computePackKindLabelKey.js"

test("names the kind of the pack", (t) => {
  t.is(
    computePackKindLabelKey({ kind: "live" }),
    "billing.settings.packs.kind.live",
  )
})

test("a pack granting AI credits reads as such", (t) => {
  t.is(
    computePackKindLabelKey({ kind: "transcription", hasAiCredits: true }),
    "billing.settings.packs.kind_with_ai",
  )
})
