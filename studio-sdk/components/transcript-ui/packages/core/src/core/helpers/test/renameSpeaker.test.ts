import { describe, expect, it } from "bun:test"
import { renameSpeaker } from "../renameSpeaker"
import { makeTestCore } from "./makeTestCore"

describe("renameSpeaker", () => {
  it("renames an existing speaker (trimmed)", () => {
    const core = makeTestCore()
    renameSpeaker(core, "spk-1", "  Marie Dupont  ")
    expect(core.speakers.all.get("spk-1")?.name).toBe("Marie Dupont")
  })

  it("ignores unknown speakers and empty names", () => {
    const core = makeTestCore()
    renameSpeaker(core, "spk-404", "X")
    renameSpeaker(core, "spk-1", "   ")
    expect(core.speakers.all.get("spk-1")?.name).toBe("Marie")
    expect(core.speakers.all.has("spk-404")).toBe(false)
  })
})
