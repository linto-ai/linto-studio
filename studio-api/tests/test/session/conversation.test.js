/**
 * Wiring tests for initCaptionsForConversation (conversation.js).
 *
 * The channelCaptions.test.js suite exercises dedupeClosedCaptionsBySegmentId
 * and processChannelCaptions in isolation, and its "dual-recognizer end-to-end"
 * block RE-SIMULATES the pipeline with local helpers. None of that proves the
 * REAL initCaptionsForConversation actually invokes the dedup, nor that it runs
 * BEFORE the translatedCaptions merge.
 *
 * These tests call the real initCaptionsForConversation on a realistic
 * dual-recognizer session payload and assert on the produced captions, so that
 * removing or moving the dedup call (e.g. after the translation merge) would
 * break them.
 *
 * Only require-time dependencies that would otherwise open a Mongo connection
 * or pull in the ESM music-metadata module are mocked. initCaptionsForConversation
 * itself touches none of them for the chosen payload (no DB, no audio I/O).
 */

// lib/mongodb/driver.js builds a MongoClient at require time from DB_* env vars.
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({}))

// offline.js -> generator.js -> music-metadata (ESM). Only used by the
// store path (startOfflineJob), never by initCaptionsForConversation.
jest.mock(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/offline.js`,
  () => ({ sessionReq: jest.fn() }),
)

// storeFile would do filesystem/audio I/O; the chosen payload never reaches it.
jest.mock(`${process.cwd()}/components/WebServer/controllers/files/store`, () => ({
  storeFile: jest.fn(),
}))

const { initCaptionsForConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
)
const TYPES = require(`${process.cwd()}/lib/dao/conversation/types`)

// Realistic dual-recognizer (speaker detection + translation) single-channel
// session. Each segmentId is emitted TWICE: once by the recognizer that lacks
// the locutor, once by the recognizer that carries it. The no-locutor line is
// intentionally ordered FIRST so that:
//   - dedupe keeps the locutor-bearing line (locutor !== null wins);
//   - the translation merge (Array.find by segmentId) attaches `de` to the
//     SINGLE deduped line. Without dedup, find() returns the first (no-locutor)
//     line, so the translation lands on the wrong line and the canonical
//     produces duplicate / "Unknown speaker" turns.
// compressAudio:true + keepAudio:false guarantees no storeFile/audio branch.
function buildDualRecognizerSession() {
  return {
    id: "session-dual-rec",
    name: "Dual recognizer meeting",
    owner: "owner-id",
    organizationId: "orga-id",
    visibility: "public",
    startTime: "2026-05-01T10:00:00.000Z",
    endTime: "2026-05-01T10:05:00.000Z",
    channels: [
      {
        id: "0",
        name: "fr",
        languages: "fr-FR",
        diarization: true,
        compressAudio: true,
        keepAudio: false,
        translations: [{ target: "de" }],
        closedCaptions: [
          // segment 1 — no-locutor line FIRST
          {
            segmentId: 1,
            start: 0.5,
            end: 2,
            text: "bonjour",
            lang: "fr-FR",
            locutor: null,
          },
          {
            segmentId: 1,
            start: 0.5,
            end: 2,
            text: "bonjour",
            lang: "fr-FR",
            locutor: "Alice",
          },
          // segment 2 — no-locutor line FIRST
          {
            segmentId: 2,
            start: 2,
            end: 4,
            text: "ca va",
            lang: "fr-FR",
            locutor: null,
          },
          {
            segmentId: 2,
            start: 2,
            end: 4,
            text: "ca va",
            lang: "fr-FR",
            locutor: "Bob",
          },
        ],
        translatedCaptions: {
          de: [
            { segmentId: 1, targetLang: "de", text: "hallo" },
            { segmentId: 2, targetLang: "de", text: "wie gehts" },
          ],
        },
      },
    ],
  }
}

describe("initCaptionsForConversation wiring (dual-recognizer)", () => {
  let captions, canonical, translation

  beforeEach(async () => {
    captions = await initCaptionsForConversation(buildDualRecognizerSession())
    canonical = captions.find((c) => c.type.mode !== TYPES.TRANSLATION)
    translation = captions.find((c) => c.type.mode === TYPES.TRANSLATION)
  })

  it("emits exactly one canonical and one translation caption", () => {
    expect(captions).toHaveLength(2)
    expect(canonical).toBeDefined()
    expect(translation).toBeDefined()
    expect(translation.locale).toEqual("de")
  })

  it("produces a single canonical turn per segmentId (no duplicate from the doubled input lines)", () => {
    // 2 segments, 2 input lines each (4 total) must collapse to 2 turns.
    // Without the dedup, the locutor-less duplicates survive -> 4 turns.
    expect(canonical.text).toHaveLength(2)
    const segTexts = canonical.text.map((t) => t.raw_segment).sort()
    expect(segTexts).toEqual(["bonjour", "ca va"])
  })

  it("attaches each canonical turn to its real locutor, never 'Unknown speaker'", () => {
    // The no-locutor line is ordered first; dedup must collapse it into the
    // locutor-bearing line BEFORE turns are built, otherwise the surviving
    // turn would be 'Unknown speaker'.
    const names = canonical.speakers.map((s) => s.speaker_name).sort()
    expect(names).toEqual(["Alice", "Bob"])
    expect(names).not.toContain("Unknown speaker")

    const aliceId = canonical.speakers.find(
      (s) => s.speaker_name === "Alice",
    ).speaker_id
    const bobId = canonical.speakers.find(
      (s) => s.speaker_name === "Bob",
    ).speaker_id

    const t1 = canonical.text.find((t) => t.raw_segment === "bonjour")
    const t2 = canonical.text.find((t) => t.raw_segment === "ca va")
    expect(t1.speaker_id).toEqual(aliceId)
    expect(t2.speaker_id).toEqual(bobId)
  })

  it("builds a 'de' translation caption whose turns carry the translated text", () => {
    expect(translation.type.mode).toEqual(TYPES.TRANSLATION)
    expect(translation.text).toHaveLength(2)
    const texts = translation.text.map((t) => t.raw_segment).sort()
    expect(texts).toEqual(["hallo", "wie gehts"])
    expect(translation.speakers).toHaveLength(1)
    expect(translation.speakers[0].speaker_name).toEqual("Automatic Translation")
    expect(translation.parentCaptionId).toEqual(canonical.captionId)
  })

  it("proves dedup runs BEFORE the translation merge: translations land on the kept (locutor) line", () => {
    // This is the load-bearing assertion. The no-locutor line is first; the
    // translation merge resolves the target line with Array.find by segmentId.
    //   - dedup-before-merge: only ONE line per segmentId exists (the locutor
    //     one), so translations attach to it and the translation pass emits
    //     exactly one turn per segment (2 total).
    //   - merge-before-dedup / no-dedup: find() hits the first (no-locutor)
    //     line, so the locutor line keeps NO translation. processChannelCaptions
    //     in TRANSLATION mode drops turns lacking translations[locale], yielding
    //     a different (broken) turn count and/or canonical duplicates.
    expect(translation.text).toHaveLength(canonical.text.length)
    for (const turn of translation.text) {
      expect(turn.raw_segment).not.toEqual("")
      expect(turn.segment).toEqual(turn.raw_segment)
    }
  })
})
