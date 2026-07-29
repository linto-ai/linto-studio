import { describe, expect, it } from "bun:test"
import { computeOffsetInNormalizedText } from "../computeOffsetInNormalizedText"

describe("computeOffsetInNormalizedText", () => {
  it("is identity on already-normalized text", () => {
    expect(computeOffsetInNormalizedText("Bonjour tout", 7)).toBe(7)
  })

  it("collapses whitespace runs before the caret", () => {
    // "a  b" caret before "b" (raw 3) → "a b" offset 2
    expect(computeOffsetInNormalizedText("a  b", 3)).toBe(2)
    // caret inside the run lands on the single surviving space
    expect(computeOffsetInNormalizedText("a  b", 2)).toBe(2)
  })

  it("drops typed leading whitespace", () => {
    expect(computeOffsetInNormalizedText("  Bonjour", 4)).toBe(2)
  })

  it("clamps past the trailing whitespace to the normalized end", () => {
    expect(computeOffsetInNormalizedText("ab  ", 4)).toBe(2)
  })
})
