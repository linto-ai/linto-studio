import test from "ava"
import processSessionCaptions from "../processSessionCaptions.js"

test("events carry speakerDefined from locutorDefined", (t) => {
  const events = processSessionCaptions({
    closedCaptions: [
      {
        segmentId: 1,
        start: 0,
        end: 1,
        astart: "2026-02-24T09:40:15.000Z",
        text: "bonjour",
        locutor: "Guest-1",
        locutorDefined: false,
      },
      {
        segmentId: 2,
        start: 1,
        end: 2,
        astart: "2026-02-24T09:40:15.000Z",
        text: "salut",
        locutor: "Alice",
        locutorDefined: true,
      },
      {
        segmentId: 3,
        start: 2,
        end: 3,
        astart: "2026-02-24T09:40:15.000Z",
        text: "rien",
        locutor: null,
      },
    ],
    translatedCaptions: {},
    diarization: true,
    defaultLanguage: "fr",
  })
  t.deepEqual(
    events.map((e) => [e.speakerId, e.speakerDefined]),
    [
      ["Guest-1", false],
      ["Alice", true],
      [null, undefined],
    ],
  )
})
