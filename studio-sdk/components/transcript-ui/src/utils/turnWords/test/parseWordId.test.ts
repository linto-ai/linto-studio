import { describe, expect, it } from "bun:test"
import { parseWordId } from "../parseWordId"
import { wordId } from "../wordId"

describe("parseWordId", () => {
  it("round-trips wordId", () => {
    expect(parseWordId(wordId("turn-1", 4))).toEqual({
      turnId: "turn-1",
      index: 4,
    })
  })

  it("splits on the LAST separator (turn ids may contain '#')", () => {
    expect(parseWordId("a#b#7")).toEqual({ turnId: "a#b", index: 7 })
  })

  it("rejects malformed ids", () => {
    expect(parseWordId("no-separator")).toBeNull()
    expect(parseWordId("#3")).toBeNull()
    expect(parseWordId("turn-1#")).toBeNull()
    expect(parseWordId("turn-1#-2")).toBeNull()
    expect(parseWordId("turn-1#1.5")).toBeNull()
  })
})
