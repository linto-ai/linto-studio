import { describe, expect, it } from "bun:test"
import { computeUnstableVersion } from "../computeUnstableVersion.mjs"

describe("computeUnstableVersion", () => {
  it("suffixes the UTC minute", () => {
    expect(
      computeUnstableVersion("0.9.24", new Date("2026-10-15T14:27:59+02:00")),
    ).toBe("0.9.24-unstable.202610151227")
  })

  it("zero-pads every field", () => {
    expect(
      computeUnstableVersion("1.0.0", new Date(Date.UTC(2027, 0, 2, 3, 4))),
    ).toBe("1.0.0-unstable.202701020304")
  })
})
