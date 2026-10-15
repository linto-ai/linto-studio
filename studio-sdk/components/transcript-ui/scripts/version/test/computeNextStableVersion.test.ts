import { describe, expect, it } from "bun:test"
import { computeNextStableVersion } from "../computeNextStableVersion.mjs"

describe("computeNextStableVersion", () => {
  it("bumps the patch of the last stable published", () => {
    expect(computeNextStableVersion(["0.9.22", "0.9.23"], "0.9.0")).toBe(
      "0.9.24",
    )
  })

  it("compares versions numerically, not as strings", () => {
    expect(computeNextStableVersion(["0.9.9", "0.9.10", "0.10.0"], "0.0.0")).toBe(
      "0.10.1",
    )
  })

  it("ignores prereleases, even ones above the last stable", () => {
    expect(
      computeNextStableVersion(
        ["0.9.23", "0.9.24-unstable.202610151200", "1.0.0-beta.1"],
        "0.9.0",
      ),
    ).toBe("0.9.24")
  })

  it("takes package.json's version when it is higher", () => {
    expect(computeNextStableVersion(["0.9.23"], "0.10.0")).toBe("0.10.0")
  })

  it("keeps the bump when package.json's version is already published", () => {
    expect(computeNextStableVersion(["0.9.23", "0.9.24"], "0.9.24")).toBe(
      "0.9.25",
    )
  })

  it("starts from package.json's version on an empty registry", () => {
    expect(computeNextStableVersion([], "0.9.24")).toBe("0.9.24")
  })
})
