import { describe, expect, it } from "bun:test"
import { computeUpdatedTurnFields } from "../computeUpdatedTurnFields"
import { utils } from "@linto/transcript-ui-core"

const { layoutWords } = utils

describe("computeUpdatedTurnFields", () => {
  it("re-derives positional words and nulls the text (turn contract)", () => {
    const { text, words } = computeUpdatedTurnFields("turn-1", "Bonjour le", [])
    expect(text).toBeNull()
    expect(words.map((w) => w.id)).toEqual(["turn-1#0", "turn-1#1"])
  })

  it("carries the previous timings onto the unchanged prefix/suffix", () => {
    const oldWords = layoutWords("turn-1", [
      { text: "Bonjour", startTime: 0, endTime: 0.8 },
      { text: "tout", startTime: 0.9, endTime: 1.1 },
      { text: "monde", startTime: 1.4, endTime: 1.8 },
    ])
    const { words } = computeUpdatedTurnFields(
      "turn-1",
      "Bonjour tous monde",
      oldWords,
    )
    expect(words[0]?.startTime).toBe(0)
    expect(words[1]?.startTime).toBeUndefined()
    expect(words[2]?.startTime).toBe(1.4)
  })

  it("keeps the text for a words-less result (emptied turn)", () => {
    const { text, words } = computeUpdatedTurnFields("turn-1", "", [])
    expect(words).toEqual([])
    expect(text).toBe("")
  })
})
