import { describe, expect, it } from "bun:test"
import { mergeSpeakers } from "../mergeSpeakers"
import { makeTestCore } from "./makeTestCore"

describe("mergeSpeakers", () => {
  it("reassigns every turn then removes the merged-away speaker", () => {
    const core = makeTestCore()
    mergeSpeakers(core, "spk-1", "spk-2")
    const turns = core.activeChannel.value!.sourceTranslation.turns.value
    expect(turns.every((t) => t.speakerId === "spk-2")).toBe(true)
    expect(core.speakers.all.has("spk-1")).toBe(false)
    expect(core.speakers.all.has("spk-2")).toBe(true)
  })

  it("is a no-op on same ids or unknown speakers", () => {
    const core = makeTestCore()
    mergeSpeakers(core, "spk-1", "spk-1")
    mergeSpeakers(core, "spk-404", "spk-2")
    expect(core.speakers.all.has("spk-1")).toBe(true)
    expect(
      core.activeChannel.value?.sourceTranslation.getTurn("turn-1")?.speakerId,
    ).toBe("spk-1")
  })
})
