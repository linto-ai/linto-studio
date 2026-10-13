import test from "ava"
import { computeAssistantsTrack } from "../computeAssistantsTrack.js"

const source = { id: "source" }
const english = { id: "english" }

function buildChannel(activeId) {
  return {
    sourceTranslation: source,
    translations: new Map([
      [source.id, source],
      [english.id, english],
    ]),
    activeTranslation: { value: { id: activeId } },
  }
}

test("computeAssistantsTrack() is the source track when it is displayed", (t) => {
  t.is(computeAssistantsTrack(buildChannel("source")), source)
})

test("computeAssistantsTrack() is the displayed translation track", (t) => {
  t.is(computeAssistantsTrack(buildChannel("english")), english)
})

test("computeAssistantsTrack() falls back on the source for the virtual cross view", (t) => {
  t.is(computeAssistantsTrack(buildChannel("cross")), source)
})
