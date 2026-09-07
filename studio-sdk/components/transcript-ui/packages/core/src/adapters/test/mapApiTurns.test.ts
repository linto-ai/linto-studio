import { describe, expect, it } from "bun:test"
import { mapApiTurns } from "../mapApiTurns"

describe("mapApiTurns", () => {
  it("maps a turn with words: positional ids, offsets, turn times from words", () => {
    const [turn] = mapApiTurns([
      {
        turn_id: "turn-1",
        speaker_id: "spk-1",
        segment: "Bonjour tout",
        raw_segment: "Bonjour tout",
        language: "fr",
        words: [
          { wid: "w-a", word: "Bonjour", stime: 0.5, etime: 0.8 },
          { wid: "w-b", word: "tout", stime: 0.9, etime: 1.1 },
        ],
      },
    ])
    expect(turn).toMatchObject({
      id: "turn-1",
      speakerId: "spk-1",
      text: null,
      startTime: 0.5,
      endTime: 1.1,
      language: "fr",
    })
    expect(turn?.words.map((w) => w.id)).toEqual(["turn-1#0", "turn-1#1"])
    expect(turn?.words[0]).toMatchObject({ charStart: 0, charEnd: 7 })
    // The wire wid never reaches the editor model.
    expect(turn?.words[0] && "wid" in turn.words[0]).toBe(false)
  })

  it("falls back to the segment and turn-level times for words-less turns", () => {
    const [turn] = mapApiTurns([
      {
        turn_id: "turn-2",
        speaker_id: "",
        segment: "texte brut",
        raw_segment: "texte brut",
        language: "fr",
        words: [],
        stime: 3,
        etime: 5,
      },
    ])
    expect(turn).toMatchObject({
      id: "turn-2",
      speakerId: null,
      text: "texte brut",
      words: [],
      startTime: 3,
      endTime: 5,
    })
  })

  it("drops silence placeholders (empty words) from the word list", () => {
    const [turn] = mapApiTurns([
      {
        turn_id: "turn-3",
        speaker_id: "spk-1",
        segment: "mot",
        raw_segment: "mot",
        language: "fr",
        words: [
          { word: "", stime: 0, etime: 1 },
          { word: "mot", stime: 1, etime: 2 },
        ],
      },
    ])
    expect(turn?.words.map((w) => w.text)).toEqual(["mot"])
    expect(turn?.words[0]?.charStart).toBe(0)
  })
})
