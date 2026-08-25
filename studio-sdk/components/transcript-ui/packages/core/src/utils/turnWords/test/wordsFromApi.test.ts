import { describe, expect, it } from "bun:test"
import { wordsFromApi } from "../wordsFromApi"

describe("wordsFromApi", () => {
  it("maps API fields (word/stime/etime/confidence) onto store words", () => {
    const words = wordsFromApi("turn-1", [
      { wid: "w1", word: "Bonjour", stime: 0, etime: 0.8, confidence: 0.9 },
      { wid: "w2", word: "tout" },
    ])
    expect(words[0]).toMatchObject({
      id: "turn-1#0",
      text: "Bonjour",
      startTime: 0,
      endTime: 0.8,
      confidence: 0.9,
    })
    expect(words[1]).toMatchObject({ id: "turn-1#1", text: "tout" })
    expect(words[1] && "startTime" in words[1]).toBe(false)
  })
})
