import { describe, expect, it } from "bun:test"
import splitPartialSubtitles, {
  getIndexesWhereToCutText,
} from "../splitPartialSubtitles"

// A line is "too long" once it exceeds `maxWords` words. Word-based so the cut
// positions stay easy to reason about: one cut roughly every `maxWords` words.
const tooLongAfter = (maxWords: number) => (text: string) =>
  text.split(" ").length > maxWords

describe("getIndexesWhereToCutText", () => {
  it("returns no cut when the text fits", () => {
    expect(getIndexesWhereToCutText("a b c", tooLongAfter(3))).toEqual([])
  })

  it("returns no cut for a single word, even when it is too long", () => {
    expect(getIndexesWhereToCutText("word", (t) => t.length > 1)).toEqual([])
  })

  it("cuts once when the text is one line too long", () => {
    expect(getIndexesWhereToCutText("a b c d e", tooLongAfter(3))).toEqual([3])
  })

  it("cuts repeatedly for a very long text", () => {
    expect(getIndexesWhereToCutText("a b c d e f g h", tooLongAfter(3))).toEqual([
      3, 6,
    ])
  })
})

describe("splitPartialSubtitles", () => {
  const emptyState = { previousText: "", previousIndexes: [] as number[] }

  it("returns the previous state untouched for empty text", () => {
    const state = { previousText: "a b", previousIndexes: [1] }
    expect(splitPartialSubtitles(state, "", tooLongAfter(3))).toEqual(state)
  })

  it("produces no cut for a short fresh text", () => {
    expect(splitPartialSubtitles(emptyState, "a b", tooLongAfter(3))).toEqual({
      previousText: "a b",
      previousIndexes: [],
    })
  })

  it("cuts a long fresh text", () => {
    expect(splitPartialSubtitles(emptyState, "a b c d e", tooLongAfter(3))).toEqual(
      { previousText: "a b c d e", previousIndexes: [3] },
    )
  })

  it("keeps the earlier cut stable when the text grows", () => {
    const state = { previousText: "a b c d e", previousIndexes: [3] }
    expect(
      splitPartialSubtitles(state, "a b c d e f g", tooLongAfter(3)),
    ).toEqual({ previousText: "a b c d e f g", previousIndexes: [3, 6] })
  })

  it("does not cut when a word is replaced without overflowing", () => {
    const state = { previousText: "hello world", previousIndexes: [] }
    expect(splitPartialSubtitles(state, "hi world", tooLongAfter(3))).toEqual({
      previousText: "hi world",
      previousIndexes: [],
    })
  })
})

// Two stable lines of three words each, cut at index 3:
//   "mot1 mot2 mot3 | mot4 mot5 mot6"
// These pin how an edit shifts (or keeps) that cut.
describe("splitPartialSubtitles — cut shifting on edits", () => {
  const twoLines = {
    previousText: "mot1 mot2 mot3 mot4 mot5 mot6",
    previousIndexes: [3],
  }

  const indexesAfter = (next: string): number[] =>
    splitPartialSubtitles(twoLines, next, tooLongAfter(3)).previousIndexes

  it("keeps the cut when line 1 is replaced word-for-word (1 word -> 2, 1 deleted)", () => {
    // mot2 mot3 -> mot2.1 mot2.2 (still 2 words), line 2 stays 3 words
    expect(indexesAfter("mot1 mot2.1 mot2.2 mot4 mot6 mot7")).toEqual([3])
  })

  it("keeps the cut on a 1:1 replacement plus a tail delete/add", () => {
    expect(indexesAfter("mot1 mot2.1 mot3 mot5 mot6 mot7")).toEqual([3])
  })

  it("keeps the cut when a word is duplicated across both lines", () => {
    // mot2 -> mot4, so "mot4" now appears in both lines
    expect(indexesAfter("mot1 mot4 mot3 mot4 mot5 mot6")).toEqual([3])
  })

  it("shifts the cut right when a word is inserted in line 1", () => {
    // KNOWN OVERFLOW BUG: line 1 ends up with 4 words and is NOT re-cut.
    // Expected to change once the two-threshold fix re-validates earlier lines.
    expect(indexesAfter("mot1 inserted mot2 mot3 mot4 mot5 mot6")).toEqual([4])
  })

  it("shifts the cut left when a word is deleted in line 1", () => {
    expect(indexesAfter("mot1 mot3 mot4 mot5 mot6")).toEqual([2])
  })

  it("re-cuts the last line when it grows too long", () => {
    expect(indexesAfter("mot1 mot2 mot3 mot4 mot5 mot6 mot7 mot8")).toEqual([
      3, 6,
    ])
  })

  it("re-cuts the last line when a word is inserted into line 2", () => {
    expect(indexesAfter("mot1 mot2 mot3 mot4 inserted mot5 mot6")).toEqual([
      3, 6,
    ])
  })
})
