import { describe, expect, it } from "bun:test"
import { wordId } from "../wordId"

describe("wordId", () => {
  it("derives the positional key", () => {
    expect(wordId("turn-1", 0)).toBe("turn-1#0")
    expect(wordId("turn-1", 12)).toBe("turn-1#12")
  })
})
