import { describe, expect, it } from "bun:test"
import { carryWordTimes } from "../carryWordTimes"
import { wordsFromText } from "../wordsFromText"
import { layoutWords } from "../layoutWords"

const prev = layoutWords("turn-1", [
  { text: "Bonjour", startTime: 0, endTime: 0.8 },
  { text: "tout", startTime: 0.9, endTime: 1.1 },
  { text: "le", startTime: 1.2, endTime: 1.3 },
  { text: "monde", startTime: 1.4, endTime: 1.8 },
])

describe("carryWordTimes", () => {
  it("keeps every timing when the text is unchanged", () => {
    const next = carryWordTimes(
      wordsFromText("turn-1", "Bonjour tout le monde"),
      prev,
    )
    expect(next.map((w) => w.startTime)).toEqual([0, 0.9, 1.2, 1.4])
  })

  it("keeps prefix/suffix timings and leaves the edited middle untimed", () => {
    const next = carryWordTimes(
      wordsFromText("turn-1", "Bonjour tous le monde"),
      prev,
    )
    expect(next[0]?.startTime).toBe(0)
    expect(next[1]?.startTime).toBeUndefined()
    expect(next[2]?.startTime).toBe(1.2)
    expect(next[3]?.startTime).toBe(1.4)
  })

  it("anchors the suffix by position from the end on insertion", () => {
    const next = carryWordTimes(
      wordsFromText("turn-1", "Bonjour vraiment tout le monde"),
      prev,
    )
    expect(next.map((w) => w.startTime)).toEqual([0, undefined, 0.9, 1.2, 1.4])
  })

  it("carries what survives a deletion", () => {
    const next = carryWordTimes(wordsFromText("turn-1", "Bonjour le monde"), prev)
    expect(next[0]?.startTime).toBe(0)
    expect(next[1]?.startTime).toBe(1.2)
    expect(next[2]?.startTime).toBe(1.4)
  })
})
