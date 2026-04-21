import test from "ava"
import sessionToEditorDocument from "../sessionToEditorDocument.js"

// Session with multiple stream restarts (real data)
const sessionWithRestart = {
  id: "79f9e9a5-5f40-4f05-9938-0a5a482e5508",
  status: "ready",
  name: "test",
  startTime: "2026-02-24T09:40:15.014Z",
  endTime: null,
  channels: [
    {
      id: 1,
      name: "asr description",
      languages: ["fr-FR"],
      translations: [],
      translatedCaptions: null,
      closedCaptions: [
        // Stream 1
        { end: 3.5828, text: "Il n'est que pour réaliser une action.", start: 0, astart: "2026-02-24T09:40:15.001Z", locutor: null, segmentId: 1 },
        { end: 9.9863828, text: "Or précisément les grandes contradictions.", start: 3.5828, astart: "2026-02-24T09:40:15.001Z", locutor: null, segmentId: 2 },
        { aend: "2026-02-24T09:40:43.901Z", astart: "2026-02-24T09:40:15.001Z", locutor: "bot" },
        // Stream 2 (3 days later — start resets to 0!)
        { end: 6.4008, text: "C'est Et du coup là ça me transcrit.", start: 0, astart: "2026-02-27T14:41:11.104Z", locutor: null, segmentId: 1 },
        { end: 10.5452008, text: "transcrit des trucs.", start: 6.4008, astart: "2026-02-27T14:41:11.104Z", locutor: null, segmentId: 2 },
        { aend: "2026-02-27T14:41:36.961Z", astart: "2026-02-27T14:41:11.104Z", locutor: "bot" },
        // Stream 3 (no captions, just bot marker)
        { aend: "2026-02-27T14:44:16.061Z", astart: "2026-02-27T14:44:10.096Z", locutor: "bot" },
        // Stream 4 (minutes later — start resets to 0 again)
        { end: 17.6628, text: "Non seulement le terme atteint.", start: 0, astart: "2026-02-27T14:45:34.257Z", locutor: null, segmentId: 1 },
        { end: 19.9844628, text: "Pour nous esprits humains.", start: 17.6628, astart: "2026-02-27T14:45:34.257Z", locutor: null, segmentId: 2 },
        { aend: "2026-02-27T14:46:54.683Z", astart: "2026-02-27T14:45:34.257Z", locutor: "bot" },
      ],
    },
  ],
}

// Helper: compute expected absolute time in seconds from session start (clamped to 0)
function expectedTime(sessionStartTime, astart, offset) {
  return Math.max(0, (new Date(astart).getTime() - new Date(sessionStartTime).getTime()) / 1000 + offset)
}

test("bot markers are filtered out", (t) => {
  const doc = sessionToEditorDocument(sessionWithRestart)
  const turns = doc.channels[0].translations.find((tr) => tr.isSource).turns
  t.is(turns.length, 6)
})

test("startTime/endTime use astart, not raw stream offset", (t) => {
  const doc = sessionToEditorDocument(sessionWithRestart)
  const turns = doc.channels[0].translations.find((tr) => tr.isSource).turns
  const S = sessionWithRestart.startTime

  // Stream 1 — astart ≈ session.startTime, so times stay close to raw values
  t.is(turns[0].startTime, expectedTime(S, "2026-02-24T09:40:15.001Z", 0))
  t.is(turns[0].endTime, expectedTime(S, "2026-02-24T09:40:15.001Z", 3.5828))
  t.is(turns[1].startTime, expectedTime(S, "2026-02-24T09:40:15.001Z", 3.5828))
  t.is(turns[1].endTime, expectedTime(S, "2026-02-24T09:40:15.001Z", 9.9863828))

  // Stream 2 — 3 days later, start=0 but absolute time must NOT reset
  t.is(turns[2].startTime, expectedTime(S, "2026-02-27T14:41:11.104Z", 0))
  t.is(turns[2].endTime, expectedTime(S, "2026-02-27T14:41:11.104Z", 6.4008))
  t.true(turns[2].startTime > turns[1].endTime, "stream 2 starts after stream 1 ends")

  // Stream 4 — another restart
  t.is(turns[4].startTime, expectedTime(S, "2026-02-27T14:45:34.257Z", 0))
  t.true(turns[4].startTime > turns[3].endTime, "stream 4 starts after stream 2 ends")
})

test("turns are in chronological order across stream restarts", (t) => {
  const doc = sessionToEditorDocument(sessionWithRestart)
  const turns = doc.channels[0].translations.find((tr) => tr.isSource).turns

  for (let i = 1; i < turns.length; i++) {
    t.true(
      turns[i].startTime >= turns[i - 1].startTime,
      `turn ${i} (startTime=${turns[i].startTime}) should be >= turn ${i - 1} (startTime=${turns[i - 1].startTime})`,
    )
  }
})

test("handles undefined closedCaptions and translatedCaptions", (t) => {
  const session = {
    name: "edge",
    startTime: "2026-02-24T09:40:15.014Z",
    channels: [
      {
        id: 1,
        name: "ch",
        languages: ["fr"],
        translations: [],
      },
    ],
  }
  const doc = sessionToEditorDocument(session)
  t.is(doc.channels[0].translations.length, 1) // source only
  t.deepEqual(doc.channels[0].translations[0].turns, [])
})

test("creates bucket for translatedCaption with undeclared targetLang", (t) => {
  const session = {
    name: "orphan",
    startTime: "2026-02-24T09:40:15.000Z",
    channels: [
      {
        id: 1,
        name: "ch",
        languages: ["fr"],
        translations: [],
        closedCaptions: [],
        translatedCaptions: [
          {
            segmentId: 1,
            start: 0,
            end: 1,
            astart: "2026-02-24T09:40:15.000Z",
            text: "hello",
            targetLang: "de",
            locutor: null,
          },
        ],
      },
    ],
  }
  const doc = sessionToEditorDocument(session)
  const deTr = doc.channels[0].translations.find((t) => t.id === "de")
  t.truthy(deTr, "de translation bucket should be created")
  t.is(deTr.turns.length, 1)
  t.is(deTr.turns[0].language, "de")
  t.is(deTr.turns[0].startTime, 0)
  t.is(deTr.turns[0].endTime, 1)
})

test("translatedCaptions also use absolute times", (t) => {
  const session = {
    name: "with-translations",
    startTime: "2026-02-24T09:40:15.000Z",
    channels: [
      {
        id: 1,
        name: "ch",
        languages: ["fr-FR"],
        translations: [{ mode: "external", target: "en", translator: "gemma" }],
        closedCaptions: [],
        translatedCaptions: [
          // Stream 1
          { segmentId: 1, start: 0, end: 3, astart: "2026-02-24T09:40:15.000Z", text: "hello", targetLang: "en", locutor: null },
          // Stream 2 (later)
          { segmentId: 2, start: 0, end: 5, astart: "2026-02-24T09:41:15.000Z", text: "world", targetLang: "en", locutor: null },
        ],
      },
    ],
  }
  const doc = sessionToEditorDocument(session)
  const enTr = doc.channels[0].translations.find((t) => t.id === "en")
  t.is(enTr.turns[0].startTime, 0)
  t.is(enTr.turns[0].endTime, 3)
  t.is(enTr.turns[1].startTime, 60) // 1 minute later
  t.is(enTr.turns[1].endTime, 65) // 60 + 5
})
