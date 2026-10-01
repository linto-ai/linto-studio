import { describe, expect, it } from "bun:test"
import { computeEpochMs } from "../computeEpochMs"

describe("computeEpochMs", () => {
  it("parses an ISO string with an offset (moment().format())", () => {
    expect(computeEpochMs("2026-09-30T10:00:00+02:00")).toBe(
      Date.UTC(2026, 8, 30, 8, 0, 0),
    )
  })

  it("returns null for a missing value", () => {
    expect(computeEpochMs(undefined)).toBeNull()
    expect(computeEpochMs(null)).toBeNull()
  })

  it("returns null for an unparsable value", () => {
    expect(computeEpochMs("")).toBeNull()
    expect(computeEpochMs("not a date")).toBeNull()
  })
})
