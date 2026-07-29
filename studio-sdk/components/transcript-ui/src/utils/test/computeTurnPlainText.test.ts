import { describe, expect, it } from "bun:test"
import { computeTurnPlainText } from "../computeTurnPlainText"
import type { Turn } from "../../types/editor"

function makeTurn(partial: Partial<Turn>): Turn {
  return {
    id: "turn-1",
    speakerId: null,
    text: null,
    words: [],
    language: "fr",
    ...partial,
  }
}

describe("computeTurnPlainText", () => {
  it("joins words with single spaces", () => {
    const turn = makeTurn({
      words: [
        { id: "turn-1#0", text: "Bonjour" },
        { id: "turn-1#1", text: "tout" },
        { id: "turn-1#2", text: "le" },
      ],
    })
    expect(computeTurnPlainText(turn)).toBe("Bonjour tout le")
  })

  it("falls back to the raw text for words-less turns", () => {
    expect(computeTurnPlainText(makeTurn({ text: "texte brut" }))).toBe(
      "texte brut",
    )
    expect(computeTurnPlainText(makeTurn({}))).toBe("")
  })
})
