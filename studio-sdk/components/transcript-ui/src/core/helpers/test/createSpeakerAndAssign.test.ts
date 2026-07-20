import { describe, expect, it } from "bun:test"
import { createSpeakerAndAssign } from "../createSpeakerAndAssign"
import { makeTestCore } from "./makeTestCore"

describe("createSpeakerAndAssign", () => {
  it("creates the speaker (with a color) and assigns the turn", () => {
    const core = makeTestCore()
    const id = createSpeakerAndAssign(core, "turn-1", "Julie")
    expect(id).not.toBeNull()
    const speaker = core.speakers.all.get(id!)
    expect(speaker?.name).toBe("Julie")
    expect(speaker?.color).toBeTruthy()
    expect(
      core.activeChannel.value?.sourceTranslation.getTurn("turn-1")?.speakerId,
    ).toBe(id)
  })

  it("returns null on a blank name", () => {
    const core = makeTestCore()
    expect(createSpeakerAndAssign(core, "turn-1", "   ")).toBeNull()
  })
})
