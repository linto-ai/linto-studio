jest.mock("debug", () => () => () => {})

// music-metadata is an ESM-only dependency pulled in by generator.js for audio
// file metadata extraction; the speaker logic under test never reaches it, so a
// stub keeps the module loadable in the Jest (CommonJS) environment.
jest.mock("music-metadata", () => ({ parseStream: jest.fn() }), { virtual: true })

const {
  transcriptionToConversation,
} = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)

const { v4: uuidv4 } = require("uuid")

// Minimal conversation skeleton matching what initConversation produces, with a
// controllable transcriptionConfig.
function makeConversation(transcriptionConfig) {
  return {
    speakers: [],
    text: [],
    metadata: {
      transcription: {
        confidence: undefined,
        transcriptionConfig: transcriptionConfig || {},
      },
    },
  }
}

// A transcript with two diarization tags (spk1, spk2) and one raw UUID tag.
function makeTranscript({ spk1Name, spk2Name, uuidName, diarization_speakers } = {}) {
  return {
    confidence: 0.9,
    transcription_result: "some text",
    diarization_speakers: diarization_speakers,
    segments: [
      {
        spk_id: spk1Name,
        start: 0,
        end: 1,
        raw_segment: "Hello",
        segment: "Hello",
        words: [{ start: 0, end: 1, word: "Hello", conf: 0.9 }],
      },
      {
        spk_id: spk2Name,
        start: 1,
        end: 2,
        raw_segment: "World",
        segment: "World",
        words: [{ start: 1, end: 2, word: "World", conf: 0.8 }],
      },
      {
        spk_id: uuidName,
        start: 2,
        end: 3,
        raw_segment: "Foo",
        segment: "Foo",
        words: [{ start: 2, end: 3, word: "Foo", conf: 0.7 }],
      },
    ],
  }
}

describe("transcriptionToConversation - speaker identification", () => {
  it("(a) without speakerIdentificationConfig: UUID speaker names become speakerN, named tags kept", () => {
    const u1 = uuidv4()
    const u2 = uuidv4()
    const transcript = makeTranscript({
      spk1Name: "Alice",
      spk2Name: u1,
      uuidName: u2,
    })
    const conversation = transcriptionToConversation(
      transcript,
      makeConversation(/* no config */),
    )

    const names = conversation.speakers.map((s) => s.speaker_name)
    // "Alice" is not a UUID -> kept; the two UUID names become speaker1/speaker2
    expect(names).toContain("Alice")
    expect(names).toContain("speaker1")
    expect(names).toContain("speaker2")
    // no identification scores attached in legacy mode
    conversation.speakers.forEach((s) =>
      expect(s.identification_score).toBeUndefined(),
    )
  })

  it("(b) with speakerIdentificationConfig: unidentified spkN/UUID become 'Unknown speaker N', identified kept + scored", () => {
    const u1 = uuidv4()
    const transcript = makeTranscript({
      spk1Name: "spk1", // unidentified diarization tag
      spk2Name: "Jane Doe", // identified label
      uuidName: u1, // unidentified raw uuid
      diarization_speakers: [
        { spk_id: "Jane Doe", spk_id_score: 0.92 },
        { spk_id: "spk1", spk_id_score: 0.1 },
      ],
    })
    const conversation = transcriptionToConversation(
      transcript,
      makeConversation({
        diarizationConfig: { speakerIdentificationConfig: { collections: ["x"] } },
      }),
    )

    const byName = {}
    conversation.speakers.forEach((s) => (byName[s.speaker_name] = s))

    // Identified speaker keeps its name and gets a score
    expect(byName["Jane Doe"]).toBeDefined()
    expect(byName["Jane Doe"].identification_score).toBe(0.92)

    // Unidentified tags (spk1 and the UUID) are renamed Unknown speaker N
    const unknowns = conversation.speakers
      .map((s) => s.speaker_name)
      .filter((n) => /^Unknown speaker \d+$/.test(n))
    expect(unknowns.length).toBe(2)
    expect(unknowns).toContain("Unknown speaker 1")
    expect(unknowns).toContain("Unknown speaker 2")

    // No "spk1" or raw UUID name left after renaming
    expect(conversation.speakers.some((s) => s.speaker_name === "spk1")).toBe(false)
    expect(conversation.speakers.some((s) => s.speaker_name === u1)).toBe(false)
  })

  it("(b2) score is attached even when the diarization_speakers list is missing for some names", () => {
    const transcript = makeTranscript({
      spk1Name: "Bob",
      spk2Name: "spk2",
      uuidName: "spk3",
      diarization_speakers: [{ spk_id: "Bob", spk_id_score: 0.5 }],
    })
    const conversation = transcriptionToConversation(
      transcript,
      makeConversation({
        diarizationConfig: { speakerIdentificationConfig: {} },
      }),
    )
    const bob = conversation.speakers.find((s) => s.speaker_name === "Bob")
    expect(bob.identification_score).toBe(0.5)
    // spk2/spk3 unidentified -> renamed, no score
    const unknowns = conversation.speakers.filter((s) =>
      /^Unknown speaker/.test(s.speaker_name),
    )
    expect(unknowns.length).toBe(2)
    unknowns.forEach((s) => expect(s.identification_score).toBeUndefined())
  })

  it("(b3) gracefully handles an absent diarization_speakers array", () => {
    const transcript = makeTranscript({
      spk1Name: "spk1",
      spk2Name: "Named",
      uuidName: "spk5",
      diarization_speakers: undefined,
    })
    const conversation = transcriptionToConversation(
      transcript,
      makeConversation({
        diarizationConfig: { speakerIdentificationConfig: {} },
      }),
    )
    expect(conversation.speakers.find((s) => s.speaker_name === "Named")).toBeDefined()
    const unknowns = conversation.speakers.filter((s) =>
      /^Unknown speaker/.test(s.speaker_name),
    )
    expect(unknowns.length).toBe(2)
  })
})
