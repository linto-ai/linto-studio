const cp = structuredClone
const { processChannelCaptions } = require(
  `${process.cwd()}/components/WebServer/controllers/session/channelCaptions`,
)
const TYPES = require(`${process.cwd()}/lib/dao/conversation/types`)

const SAMPLE = require(
  `${process.cwd()}/tests/data/session/channelCaptions-sample.json`,
)

const MICROSOFT = require(
  `${process.cwd()}/tests/data/session/session-microsoft.json`,
)

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
      // Offsets are anchored on the previous flux's last caption end
      // (post-shift), not on bot.aend - bot.astart wall-clock spans.
      // Flux 0 emax = 37.13 → flux 1 starts here.
      // Flux 1 emax (post-shift) = 37.13 + 35.07 = 72.20 → flux 2 here.
      // Flux 2 emax (post-shift) = 72.20 + 56.75 = 128.95 → flux 3 here.
      const turnsBySegmentText = Object.fromEntries(
        caption.text.map((t) => [t.raw_segment, t]),
      )

      // Segments 1-11: no offset
      expect(turnsBySegmentText["canonical segment 1 fr"].stime).toEqual(0.07)
      expect(turnsBySegmentText["canonical segment 11 fr"].stime).toEqual(34.97)

      // Segments 13-16: offset = 37.13
      expect(turnsBySegmentText["canonical segment 13 fr"].stime).toEqual(37.2)
      expect(turnsBySegmentText["canonical segment 13 fr"].etime).toEqual(54.92)

      // Segments 17-19: offset = 72.20
      expect(turnsBySegmentText["canonical segment 17 fr"].stime).toEqual(72.31)
      expect(turnsBySegmentText["canonical segment 17 fr"].etime).toEqual(93.79)

      // Segments 20-32: offset = 128.95
      expect(turnsBySegmentText["canonical segment 20 fr"].stime).toEqual(
        129.02,
      )
      expect(turnsBySegmentText["canonical segment 32 fr"].stime).toEqual(
        207.92,
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
          {
            segmentId: 1,
            start: 0,
            end: 1,
            text: "a1",
            lang: "fr-FR",
            locutor: "Alice",
          },
          {
            segmentId: 2,
            start: 1,
            end: 2,
            text: "b1",
            lang: "fr-FR",
            locutor: "Bob",
          },
          {
            segmentId: 3,
            start: 2,
            end: 3,
            text: "a2",
            lang: "fr-FR",
            locutor: "Alice",
          },
          {
            segmentId: 4,
            start: 3,
            end: 4,
            text: "c1",
            lang: "fr-FR",
            locutor: "Carol",
          },
        ],
      }
      const caption = makeCaption()
      processChannelCaptions(channel, caption, true)

      const names = caption.speakers.map((s) => s.speaker_name).sort()
      expect(names).toEqual(["Alice", "Bob", "Carol"])

      // Alice's two turns share the same speaker_id
      const aliceId = caption.speakers.find(
        (s) => s.speaker_name === "Alice",
      ).speaker_id
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

  describe("repeated calls on the same channel (canonical + translations)", () => {
    // Regression: processChannelCaptions used to mutate segment.start/end
    // in place, so when conversation.js called it once for the canonical
    // caption and once per target language on the SAME channel object,
    // the offset compounded by the rank of the call.
    it("produces identical stime/etime for canonical and each translation", () => {
      const session = cp(SAMPLE)
      const channel = session.channels[0]
      applyTranslationsToSegments(channel)
      const targetLangs = ["et", "en", "de"]

      const canonical = makeCaption({ mode: TYPES.CHILD })
      processChannelCaptions(channel, canonical, true)

      const translations = targetLangs.map((locale) => {
        const c = makeCaption({ mode: TYPES.TRANSLATION, locale })
        processChannelCaptions(channel, c, false)
        return { locale, caption: c }
      })

      const canonicalBySegId = Object.fromEntries(
        canonical.text.map((t) => [t.raw_segment.match(/segment (\d+)/)[1], t]),
      )

      for (const { locale, caption } of translations) {
        for (const turn of caption.text) {
          const segId = turn.raw_segment.match(/translation (\d+) /)[1]
          const canonicalTurn = canonicalBySegId[segId]
          expect({
            locale,
            segId,
            stime: turn.stime,
            etime: turn.etime,
          }).toEqual({
            locale,
            segId,
            stime: canonicalTurn.stime,
            etime: canonicalTurn.etime,
          })
        }
      }
    })

    it("does not mutate channel.closedCaptions across calls", () => {
      const session = cp(SAMPLE)
      const channel = session.channels[0]
      applyTranslationsToSegments(channel)
      const before = cp(channel.closedCaptions)

      const c1 = makeCaption({ mode: TYPES.CHILD })
      processChannelCaptions(channel, c1, true)
      const c2 = makeCaption({ mode: TYPES.TRANSLATION, locale: "et" })
      processChannelCaptions(channel, c2, false)
      const c3 = makeCaption({ mode: TYPES.TRANSLATION, locale: "en" })
      processChannelCaptions(channel, c3, false)

      for (let i = 0; i < before.length; i++) {
        expect(channel.closedCaptions[i].start).toEqual(before[i].start)
        expect(channel.closedCaptions[i].end).toEqual(before[i].end)
      }
    })
  })

  describe("with the real Microsoft session fixture", () => {
    // Real session payload from session-api, trimmed to what the tests
    // exercise: 1 channel, 12 non-bot segments split across 3 flux
    // (4 / 6 / 2), 2 translation targets (ar, eu). Captures real STT
    // timestamps; segment & translation texts are placeholders.
    const FLUX_ENDS = [41.36, 89.35, 102.78]

    let channel, canonical
    beforeEach(() => {
      const session = cp(MICROSOFT)
      channel = session.channels[0]
      applyTranslationsToSegments(channel)
      canonical = makeCaption({ mode: TYPES.CHILD })
      processChannelCaptions(channel, canonical, true)
    })

    it("emits one turn per non-bot segment (12 total)", () => {
      expect(canonical.text).toHaveLength(12)
    })

    it("does not bump the first segment start (it is already 0.07)", () => {
      expect(canonical.text[0].stime).toEqual(0.07)
    })

    it("anchors flux N+1 on the previous flux's last caption end", () => {
      expect(canonical.text[3].etime).toEqual(FLUX_ENDS[0])
      expect(canonical.text[4].stime).toEqual(
        Number((0.07 + FLUX_ENDS[0]).toFixed(2)),
      )
      expect(canonical.text[9].etime).toEqual(FLUX_ENDS[1])
      expect(canonical.text[10].stime).toEqual(
        Number((0.07 + FLUX_ENDS[1]).toFixed(2)),
      )
      expect(canonical.text[11].etime).toEqual(FLUX_ENDS[2])
    })

    it("produces stime monotonically increasing across all turns", () => {
      for (let i = 1; i < canonical.text.length; i++) {
        expect(canonical.text[i].stime).toBeGreaterThanOrEqual(
          canonical.text[i - 1].stime,
        )
      }
    })

    it("aligns every translation target with the canonical timeline", () => {
      const targetLangs = MICROSOFT.channels[0].translations.map(
        (t) => t.target,
      )
      expect(targetLangs).toEqual(["ar", "eu"])

      for (const locale of targetLangs) {
        const tlCaption = makeCaption({ mode: TYPES.TRANSLATION, locale })
        processChannelCaptions(channel, tlCaption, false)
        expect(tlCaption.text).toHaveLength(canonical.text.length)
        for (let i = 0; i < canonical.text.length; i++) {
          expect({
            locale,
            i,
            stime: tlCaption.text[i].stime,
            etime: tlCaption.text[i].etime,
          }).toEqual({
            locale,
            i,
            stime: canonical.text[i].stime,
            etime: canonical.text[i].etime,
          })
        }
      }
    })

    it("uses 'Automatic Translation' as the speaker for every translation", () => {
      const tlCaption = makeCaption({ mode: TYPES.TRANSLATION, locale: "ar" })
      processChannelCaptions(channel, tlCaption, false)
      expect(tlCaption.speakers).toHaveLength(1)
      expect(tlCaption.speakers[0].speaker_name).toEqual(
        "Automatic Translation",
      )
    })
  })

  describe("first caption start normalization", () => {
    it("bumps the very first caption start from 0 to 0.01", () => {
      const channel = {
        diarization: false,
        closedCaptions: [
          {
            segmentId: 1,
            start: 0,
            end: 1.5,
            text: "first",
            lang: "fr-FR",
            locutor: null,
          },
          {
            segmentId: 2,
            start: 2,
            end: 3,
            text: "second",
            lang: "fr-FR",
            locutor: null,
          },
        ],
      }
      const caption = makeCaption()
      processChannelCaptions(channel, caption, true)

      expect(caption.text[0].stime).toEqual(0.01)
      expect(caption.text[0].etime).toEqual(1.5)
      expect(caption.text[1].stime).toEqual(2)
    })

    it("does not touch a non-zero first caption start", () => {
      const channel = {
        diarization: false,
        closedCaptions: [
          {
            segmentId: 1,
            start: 0.5,
            end: 1,
            text: "first",
            lang: "fr-FR",
            locutor: null,
          },
        ],
      }
      const caption = makeCaption()
      processChannelCaptions(channel, caption, true)

      expect(caption.text[0].stime).toEqual(0.5)
    })

    it("leaves start=0 untouched on captions following a bot", () => {
      const channel = {
        diarization: false,
        closedCaptions: [
          {
            segmentId: 1,
            start: 1,
            end: 5,
            text: "first",
            lang: "fr-FR",
            locutor: null,
          },
          {
            segmentId: null,
            start: null,
            end: null,
            text: "",
            astart: "2026-04-14T12:36:38.948Z",
            aend: "2026-04-14T12:37:38.948Z",
            lang: null,
            locutor: "bot",
          },
          {
            segmentId: 2,
            start: 0,
            end: 2,
            text: "after-bot",
            lang: "fr-FR",
            locutor: null,
          },
        ],
      }
      const caption = makeCaption()
      processChannelCaptions(channel, caption, true)

      // flux 0 emax=5 → offset for next flux = 5; post-bot start=0+5=5 (no bump).
      expect(caption.text[1].stime).toEqual(5)
    })

    it("does not bump start=0 when a leading bot precedes the first caption", () => {
      const channel = {
        diarization: false,
        closedCaptions: [
          {
            segmentId: null,
            start: null,
            end: null,
            text: "",
            astart: "2026-04-14T12:36:38.948Z",
            aend: "2026-04-14T12:37:38.948Z",
            lang: null,
            locutor: "bot",
          },
          {
            segmentId: 1,
            start: 0,
            end: 1,
            text: "after-leading-bot",
            lang: "fr-FR",
            locutor: null,
          },
        ],
      }
      const caption = makeCaption()
      processChannelCaptions(channel, caption, true)

      expect(caption.text[0].stime).toEqual(0)
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
