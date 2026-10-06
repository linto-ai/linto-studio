import test from "ava"
import { computeDefaultPackKey } from "../computeDefaultPackKey.js"

function pack(packKey, kind, minutes) {
  return { packKey, kind, minutes, amountCents: minutes * 10 }
}

test("the smallest pack of the first kind, not the first of the catalog", (t) => {
  t.is(
    computeDefaultPackKey([
      pack("live_50h", "live", 3000),
      pack("live_5h", "live", 300),
      pack("transcription_5h", "transcription", 300),
    ]),
    "live_5h",
  )
})

test("no pack gives null", (t) => {
  t.is(computeDefaultPackKey([]), null)
  t.is(computeDefaultPackKey(null), null)
})
