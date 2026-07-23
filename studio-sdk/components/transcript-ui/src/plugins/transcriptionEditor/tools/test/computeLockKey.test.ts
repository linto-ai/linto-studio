import { describe, expect, it } from "bun:test"
import { computeLockKey } from "../computeLockKey"

describe("computeLockKey", () => {
  it("scopes the key to the (track, turn) pair", () => {
    expect(computeLockKey("tr-1", "turn-1")).toBe("tr-1/turn-1")
    expect(computeLockKey("tr-2", "turn-1")).not.toBe(
      computeLockKey("tr-1", "turn-1"),
    )
  })
})
