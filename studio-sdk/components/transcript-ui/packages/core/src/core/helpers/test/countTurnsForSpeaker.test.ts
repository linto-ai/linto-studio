import { describe, expect, it } from "bun:test"
import { countTurnsForSpeaker } from "../countTurnsForSpeaker"
import { makeTestCore } from "./makeTestCore"

describe("countTurnsForSpeaker", () => {
  it("counts the turns assigned to the speaker in the active translation", () => {
    const core = makeTestCore()
    expect(countTurnsForSpeaker(core, "spk-1")).toBe(2)
    expect(countTurnsForSpeaker(core, "spk-2")).toBe(1)
  })

  it("returns 0 for an unknown speaker", () => {
    const core = makeTestCore()
    expect(countTurnsForSpeaker(core, "spk-404")).toBe(0)
  })
})
