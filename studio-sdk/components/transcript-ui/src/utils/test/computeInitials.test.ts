import { describe, expect, it } from "bun:test"
import { computeInitials } from "../computeInitials"

describe("computeInitials", () => {
  it("takes the first letter of the first two words, uppercased", () => {
    expect(computeInitials("Marie Dupont")).toBe("MD")
    expect(computeInitials("marie dupont durand")).toBe("MD")
  })

  it("handles single-word and empty names", () => {
    expect(computeInitials("marie")).toBe("M")
    expect(computeInitials("  ")).toBe("?")
    expect(computeInitials("")).toBe("?")
  })
})
