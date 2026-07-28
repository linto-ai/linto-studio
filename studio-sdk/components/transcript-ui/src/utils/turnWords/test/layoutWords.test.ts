import { describe, expect, it } from "bun:test"
import { layoutWords } from "../layoutWords"

describe("layoutWords", () => {
  it("lays timed words out with single-space offsets", () => {
    const words = layoutWords("turn-1", [
      { text: "Bonjour", startTime: 0, endTime: 0.8 },
      { text: "tout", startTime: 0.9, endTime: 1.1 },
    ])
    expect(words).toEqual([
      {
        id: "turn-1#0",
        text: "Bonjour",
        charStart: 0,
        charEnd: 7,
        startTime: 0,
        endTime: 0.8,
      },
      {
        id: "turn-1#1",
        text: "tout",
        charStart: 8,
        charEnd: 12,
        startTime: 0.9,
        endTime: 1.1,
      },
    ])
  })

  it("splits a source word with internal whitespace, each part keeping its timing", () => {
    const words = layoutWords("turn-1", [
      { text: "l'enfant ?", startTime: 2, endTime: 3 },
    ])
    expect(words.map((w) => w.text)).toEqual(["l'enfant", "?"])
    expect(words[0]).toMatchObject({ charStart: 0, charEnd: 8, startTime: 2 })
    expect(words[1]).toMatchObject({ charStart: 9, charEnd: 10, endTime: 3 })
  })

  it("skips silence placeholders (empty/whitespace-only words)", () => {
    const words = layoutWords("turn-1", [
      { text: "", startTime: 0, endTime: 1 },
      { text: "  " },
      { text: "mot", startTime: 1, endTime: 2 },
    ])
    expect(words.map((w) => w.text)).toEqual(["mot"])
    expect(words[0]?.charStart).toBe(0)
  })

  it("omits absent timing fields instead of writing undefined", () => {
    const [word] = layoutWords("turn-1", [{ text: "mot" }])
    expect(word && "startTime" in word).toBe(false)
    expect(word && "endTime" in word).toBe(false)
  })
})
