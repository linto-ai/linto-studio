import { describe, expect, it } from "bun:test"
import { computeIsUpToDate } from "../computeIsUpToDate"

describe("computeIsUpToDate", () => {
  it("is up to date when the report is newer than or as recent as the transcription", () => {
    expect(computeIsUpToDate(1000, 2000)).toBe(true)
    expect(computeIsUpToDate(1000, 1000)).toBe(true)
  })

  it("is outdated when the transcription was modified after the report", () => {
    expect(computeIsUpToDate(2000, 1000)).toBe(false)
  })

  it("defaults to up to date when a date is missing", () => {
    expect(computeIsUpToDate(null, 1000)).toBe(true)
    expect(computeIsUpToDate(1000, null)).toBe(true)
    expect(computeIsUpToDate(null, null)).toBe(true)
  })

  it("defaults to up to date when a date is not a finite number", () => {
    expect(computeIsUpToDate(Number.NaN, 1000)).toBe(true)
    expect(computeIsUpToDate(1000, Number.NaN)).toBe(true)
  })
})
