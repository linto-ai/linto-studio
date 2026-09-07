import { describe, expect, it } from "bun:test"
import { wordsFromText } from "../wordsFromText"

describe("wordsFromText", () => {
  it("derives positional words with offsets from plain text", () => {
    expect(wordsFromText("turn-1", "Bonjour tout le")).toEqual([
      { id: "turn-1#0", text: "Bonjour", charStart: 0, charEnd: 7 },
      { id: "turn-1#1", text: "tout", charStart: 8, charEnd: 12 },
      { id: "turn-1#2", text: "le", charStart: 13, charEnd: 15 },
    ])
  })

  it("returns no words for empty or whitespace-only text", () => {
    expect(wordsFromText("turn-1", "")).toEqual([])
    expect(wordsFromText("turn-1", "   ")).toEqual([])
  })
})
