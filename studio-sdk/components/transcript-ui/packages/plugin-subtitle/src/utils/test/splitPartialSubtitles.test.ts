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

// The overflow predicate is char-based here, standing in for pixel width:
//   tooLong  = normal cut threshold  (canvas.width - 2 * paddingInline)
//   overflows = canvas edge / overflow (canvas.width - paddingInline)
// The gap between 11 and 15 is the inline margin a line may spill into.
describe("splitPartialSubtitles — overflow on the second-to-last line", () => {
  const tooLong = (t: string) => t.length > 11
  const overflows = (t: string) => t.length > 15

  const indexesAfter = (
    prev: string,
    prevIndexes: number[],
    next: string,
  ): number[] =>
    splitPartialSubtitles(
      { previousText: prev, previousIndexes: prevIndexes },
      next,
      tooLong,
      overflows,
    ).previousIndexes

  it("pushes the overflowing tail down and keeps the head when the last line has room", () => {
    // "ddd" -> "dddd" makes line 1 leave the canvas; its tail flows down and the
    // head ("aaa bbb ccc") stays in place.
    expect(indexesAfter("aaa bbb ccc ddd z", [4], "aaa bbb ccc dddd z")).toEqual([
      3,
    ])
  })

  it("tolerates a line that only spills into the inline margin (no re-cut)", () => {
    // line 1 is 13 chars: past the soft limit (11) but within the hard one (15).
    expect(indexesAfter("aaaa bbbb ccc z", [3], "aaaa bbbb ccc z")).toEqual([3])
  })

  it("scrolls when the last line is full and cannot absorb the pushed-down word", () => {
    expect(
      indexesAfter("aaa bbb ccc ddd xxx yyy", [4], "aaa bbb ccc dddd xxx yyy"),
    ).toEqual([3, 5])
  })

  it("leaves an unsplittable wide word in place", () => {
    expect(
      indexesAfter("wordwordwordword z", [1], "wordwordwordword z"),
    ).toEqual([1])
  })

  it("does nothing when no line overflows", () => {
    expect(indexesAfter("aa bb cc z", [3], "aa bb cc z")).toEqual([3])
  })

  it("worked example: pushes the head down then re-cuts the rest", () => {
    // "mot2" widens to "mot2222" and "mot7" is appended:
    //   mot1 mot2 mot3 | mot4 mot5 mot6
    //   -> mot1 mot2222 | mot3 mot4 mot5 | mot6 mot7
    const soft = (t: string) => t.length > 14
    const hard = (t: string) => t.length > 16
    const res = splitPartialSubtitles(
      { previousText: "mot1 mot2 mot3 mot4 mot5 mot6", previousIndexes: [3] },
      "mot1 mot2222 mot3 mot4 mot5 mot6 mot7",
      soft,
      hard,
    )
    expect(res.previousIndexes).toEqual([2, 5])
  })
})
