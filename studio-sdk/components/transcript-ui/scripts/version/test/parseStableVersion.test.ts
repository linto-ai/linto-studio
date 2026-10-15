import { describe, expect, it } from "bun:test"
import { parseStableVersion } from "../parseStableVersion.mjs"

describe("parseStableVersion", () => {
  it("parses a plain x.y.z version", () => {
    expect(parseStableVersion("0.9.24")).toEqual([0, 9, 24])
    expect(parseStableVersion("12.0.3")).toEqual([12, 0, 3])
  })

  it("rejects prereleases", () => {
    expect(parseStableVersion("0.9.24-unstable.202610151200")).toBeNull()
    expect(
      parseStableVersion("0.9.23-unstable.2026101402-unstable.202610150805"),
    ).toBeNull()
  })

  it("rejects anything else", () => {
    expect(parseStableVersion("")).toBeNull()
    expect(parseStableVersion("0.9")).toBeNull()
    expect(parseStableVersion("v0.9.24")).toBeNull()
  })
})
