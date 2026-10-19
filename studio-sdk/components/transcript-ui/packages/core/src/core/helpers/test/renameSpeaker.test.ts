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

  it("turns a placeholder into a defined speaker", () => {
    const core = makeTestCore()
    core.speakers.update("spk-1", { name: "spk1", defined: false })
    renameSpeaker(core, "spk-1", "Marie")
    expect(core.speakers.all.get("spk-1")).toMatchObject({
      name: "Marie",
      defined: true,
    })
  })

  it("keeps a placeholder renamed to its own stored name", () => {
    const core = makeTestCore()
    core.speakers.update("spk-1", { name: "spk1", defined: false })
    renameSpeaker(core, "spk-1", "spk1")
    expect(core.speakers.all.get("spk-1")?.defined).toBe(false)
  })
})
