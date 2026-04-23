const cp = structuredClone
const {
  processChannelCaptions,
} = require(`${process.cwd()}/components/WebServer/controllers/session/channelCaptions`)
const TYPES = require(`${process.cwd()}/lib/dao/conversation/types`)

const SAMPLE = require(`${process.cwd()}/tests/data/session/channelCaptions-sample.json`)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

function makeCaption(overrides = {}) {
  return {
    speakers: [],
    text: [],
    locale: overrides.locale || "fr-FR",
    type: {
      mode: overrides.mode || TYPES.CHILD,
      from_session_id: "session-id",
      child_conversations: [],
    },
    ...overrides,
  }
}

// Mimic the preprocessing done in initCaptionsForConversation before
// processChannelCaptions is called (conversation.js lines 150-165).
function applyTranslationsToSegments(channel) {
  if (!channel.translatedCaptions) return
  for (const segmentTranslations of Object.values(channel.translatedCaptions)) {
    for (const tc of segmentTranslations) {
      const cc = channel.closedCaptions.find(
        (c) => c.segmentId === tc.segmentId,
      )
      if (cc) {
        if (!cc.translations || typeof cc.translations !== "object")
          cc.translations = {}
        cc.translations[tc.targetLang] = tc.text
      }
    }
  }
}

describe("processChannelCaptions", () => {
  describe("with the realistic sample session (canonical, main=true)", () => {
    let channel, caption

    beforeEach(() => {
      const session = cp(SAMPLE)
      channel = session.channels[0]
      applyTranslationsToSegments(channel)
      caption = makeCaption({ mode: TYPES.CHILD })
      processChannelCaptions(channel, caption, true)
    })

    it("produces one turn per non-bot segment (31 turns, 4 bots skipped)", () => {
      expect(caption.text).toHaveLength(31)
    })

    it("creates a single 'Unknown speaker' (all locutors are null)", () => {
      expect(caption.speakers).toHaveLength(1)
      expect(caption.speakers[0].speaker_name).toEqual("Unknown speaker")
      expect(caption.speakers[0].speaker_id).toMatch(UUID_RE)
    })

    it("attaches every turn to that single speaker", () => {
      const speakerId = caption.speakers[0].speaker_id
      for (const turn of caption.text) {
        expect(turn.speaker_id).toEqual(speakerId)
      }
    })

    it("applies cumulative offsets after each bot pause", () => {
      // Bot 1 duration: 2026-04-14T12:37:40.442Z - 2026-04-14T12:36:38.948Z = 61.494s
      // Bot 2 duration: 2026-04-14T13:46:26.698Z - 2026-04-14T13:38:01.192Z = 505.506s
      // Bot 3 duration: 2026-04-20T12:19:28.722Z - 2026-04-20T12:01:44.741Z = 1063.981s
      const turnsBySegmentText = Object.fromEntries(
        caption.text.map((t) => [t.raw_segment, t]),
      )

      // Segments 1-11: no offset
      expect(turnsBySegmentText["canonical segment 1 fr"].stime).toEqual(0.07)
      expect(turnsBySegmentText["canonical segment 11 fr"].stime).toEqual(34.97)

      // Segments 13-16: offset = 61.494
      expect(turnsBySegmentText["canonical segment 13 fr"].stime).toEqual(61.56)
      expect(turnsBySegmentText["canonical segment 13 fr"].etime).toEqual(79.28)

      // Segments 17-19: offset = 61.494 + 505.506 = 567.0
      expect(turnsBySegmentText["canonical segment 17 fr"].stime).toEqual(
        567.11,
      )
      expect(turnsBySegmentText["canonical segment 17 fr"].etime).toEqual(
        588.59,
      )

      // Segments 20-32: offset = 567.0 + 1063.981 = 1630.981
      expect(turnsBySegmentText["canonical segment 20 fr"].stime).toEqual(
        1631.05,
      )
      expect(turnsBySegmentText["canonical segment 32 fr"].stime).toEqual(
        1709.95,
      )
    })

    it("preserves the per-segment language (en-GB isolated among fr-FR)", () => {
      const seg3 = caption.text.find(
        (t) => t.raw_segment === "canonical segment 3 en",
      )
      expect(seg3.lang).toEqual("en-GB")
      const seg4 = caption.text.find(
        (t) => t.raw_segment === "canonical segment 4 fr",
      )
      expect(seg4.lang).toEqual("fr-FR")
    })

    it("populates words from raw_segment via whitespace split", () => {
      const seg1 = caption.text.find(
        (t) => t.raw_segment === "canonical segment 1 fr",
      )
      expect(seg1.words).toHaveLength(4)
      expect(seg1.words.map((w) => w.word)).toEqual([
        "canonical",
        "segment",
        "1",
        "fr",
      ])
      for (const w of seg1.words) {
        expect(w.wid).toMatch(UUID_RE)
      }
    })

    it("emits a turn_id per turn and never includes bot text", () => {
      for (const turn of caption.text) {
        expect(turn.turn_id).toMatch(UUID_RE)
        expect(turn.raw_segment).not.toEqual("")
      }
    })
  })

  describe("with the realistic sample session (translation, et)", () => {
    let channel, caption

    beforeEach(() => {
      const session = cp(SAMPLE)
      channel = session.channels[0]
      applyTranslationsToSegments(channel)
      caption = makeCaption({ mode: TYPES.TRANSLATION, locale: "et" })
      processChannelCaptions(channel, caption, false)
    })

    it("produces one turn per non-bot segment", () => {
      expect(caption.text).toHaveLength(31)
    })

    it("uses a single 'Automatic Translation' speaker", () => {
      expect(caption.speakers).toHaveLength(1)
      expect(caption.speakers[0].speaker_name).toEqual("Automatic Translation")
    })

    it("replaces segment/raw_segment with the Estonian translation", () => {
      const allTexts = caption.text.map((t) => t.raw_segment)
      expect(allTexts).toContain("translation 1 et")
      expect(allTexts).toContain("translation 32 et")
      // No canonical text leaks into the translation caption
      for (const t of caption.text) {
        expect(t.segment).toEqual(t.raw_segment)
        expect(t.raw_segment.endsWith(" et")).toBe(true)
      }
    })
  })

  describe("diarization flag", () => {
    it("filters out segments without locutor when main=true and diarization=true", () => {
      const channel = {
        diarization: true,
        closedCaptions: [
          {
            segmentId: 1,
            start: 0,
            end: 1,
            text: "with locutor",
            lang: "fr-FR",
            locutor: "Alice",
          },
          {
            segmentId: 2,
            start: 1,
            end: 2,
            text: "without locutor",
            lang: "fr-FR",
            locutor: null,
          },
        ],
      }
      const caption = makeCaption()
      processChannelCaptions(channel, caption, true)

      expect(caption.text).toHaveLength(1)
      expect(caption.text[0].raw_segment).toEqual("with locutor")
    })

    it("keeps segments without locutor when diarization=false", () => {
      const channel = {
        diarization: false,
        closedCaptions: [
          {
            segmentId: 1,
            start: 0,
            end: 1,
            text: "without locutor",
            lang: "fr-FR",
            locutor: null,
          },
        ],
      }
      const caption = makeCaption()
      processChannelCaptions(channel, caption, true)

      expect(caption.text).toHaveLength(1)
    })
  })

  describe("multiple locutors", () => {
    it("creates one speaker per distinct locutor, reusing existing ones", () => {
      const channel = {
        diarization: true,
        closedCaptions: [
          { segmentId: 1, start: 0, end: 1, text: "a1", lang: "fr-FR", locutor: "Alice" },
          { segmentId: 2, start: 1, end: 2, text: "b1", lang: "fr-FR", locutor: "Bob" },
          { segmentId: 3, start: 2, end: 3, text: "a2", lang: "fr-FR", locutor: "Alice" },
          { segmentId: 4, start: 3, end: 4, text: "c1", lang: "fr-FR", locutor: "Carol" },
        ],
      }
      const caption = makeCaption()
      processChannelCaptions(channel, caption, true)

      const names = caption.speakers.map((s) => s.speaker_name).sort()
      expect(names).toEqual(["Alice", "Bob", "Carol"])

      // Alice's two turns share the same speaker_id
      const aliceId = caption.speakers.find((s) => s.speaker_name === "Alice")
        .speaker_id
      const aliceTurns = caption.text.filter((t) => t.speaker_id === aliceId)
      expect(aliceTurns).toHaveLength(2)
    })
  })

  describe("translation missing for target locale", () => {
    it("filters out the turn when translations[locale] is absent", () => {
      const channel = {
        diarization: false,
        closedCaptions: [
          {
            segmentId: 1,
            start: 0,
            end: 1,
            text: "fr only",
            lang: "fr-FR",
            locutor: null,
            translations: { en: "en text" }, // no 'et'
          },
          {
            segmentId: 2,
            start: 1,
            end: 2,
            text: "fr too",
            lang: "fr-FR",
            locutor: null,
            translations: { et: "et text", en: "en text" },
          },
        ],
      }
      const caption = makeCaption({ mode: TYPES.TRANSLATION, locale: "et" })
      processChannelCaptions(channel, caption, false)

      expect(caption.text).toHaveLength(1)
      expect(caption.text[0].raw_segment).toEqual("et text")
    })
  })

  describe("empty channel", () => {
    it("produces no turn and no speaker", () => {
      const channel = { diarization: false, closedCaptions: [] }
      const caption = makeCaption()
      processChannelCaptions(channel, caption, true)

      expect(caption.text).toEqual([])
      expect(caption.speakers).toEqual([])
    })
  })

  describe("bot segment without aend (current behavior)", () => {
    // A bot segment without aend falls through to the non-bot branch:
    // it is pushed to closedCaptions and produces a turn. Guarding this
    // so the behavior doesn't silently regress during refactor.
    it("is treated as a regular segment when aend is missing", () => {
      const channel = {
        diarization: false,
        closedCaptions: [
          {
            segmentId: null,
            start: 5,
            end: 6,
            text: "",
            astart: "2026-04-14T12:36:38.948Z",
            aend: null,
            lang: null,
            locutor: "bot",
          },
        ],
      }
      const caption = makeCaption()
      processChannelCaptions(channel, caption, true)

      expect(caption.text).toHaveLength(1)
      expect(caption.speakers).toHaveLength(1)
      expect(caption.speakers[0].speaker_name).toEqual("bot")
    })
  })
})
