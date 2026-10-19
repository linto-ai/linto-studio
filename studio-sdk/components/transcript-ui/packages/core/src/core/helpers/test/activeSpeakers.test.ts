import { describe, expect, it } from "bun:test"
import { makeTestCore } from "./makeTestCore"

function activeTranslation(core: ReturnType<typeof makeTestCore>) {
  return core.activeChannel.value!.activeTranslation.value
}

describe("core.activeSpeakers", () => {
  it("lists the speakers of the active translation's turns", () => {
    const core = makeTestCore()
    expect(core.activeSpeakers.value.map((s) => s.id)).toEqual(["spk-1", "spk-2"])
  })

  it("leaves out the speakers of the other tracks", () => {
    const core = makeTestCore()
    core.speakers.ensure("spk-other", "Elsewhere")
    expect(core.activeSpeakers.value.map((s) => s.id)).toEqual(["spk-1", "spk-2"])
  })

  it("keeps the same array on a text edit", () => {
    const core = makeTestCore()
    const before = core.activeSpeakers.value
    activeTranslation(core).updateTurn("turn-1", { text: "edited" })
    expect(core.activeSpeakers.value).toBe(before)
  })

  it("follows a speaker switch", () => {
    const core = makeTestCore()
    activeTranslation(core).updateTurn("turn-2", { speakerId: "spk-1" })
    expect(core.activeSpeakers.value.map((s) => s.id)).toEqual(["spk-1"])
  })
})
