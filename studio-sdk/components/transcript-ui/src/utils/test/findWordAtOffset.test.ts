import { describe, expect, it } from "bun:test"
import { findWordAtOffset } from "../findWordAtOffset"
import { wordsFromText } from "../turnWords"

// "Bonjour tout" — Bonjour[0,7[ tout[8,12[
const WORDS = wordsFromText("turn-1", "Bonjour tout")

describe("findWordAtOffset", () => {
  it("resolves the word containing the offset", () => {
    expect(findWordAtOffset(WORDS, 0)?.text).toBe("Bonjour")
    expect(findWordAtOffset(WORDS, 6)?.text).toBe("Bonjour")
    expect(findWordAtOffset(WORDS, 8)?.text).toBe("tout")
  })

  it("returns nothing in a gap or past the end", () => {
    expect(findWordAtOffset(WORDS, 7)).toBeUndefined()
    expect(findWordAtOffset(WORDS, 12)).toBeUndefined()
  })

  it("skips words without offsets", () => {
    expect(
      findWordAtOffset([{ id: "t#0", text: "x" }], 0),
    ).toBeUndefined()
  })
})
