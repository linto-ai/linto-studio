import { describe, expect, it } from "bun:test"
import { switchTurnSpeaker } from "../switchTurnSpeaker"
import { makeTestCore } from "./makeTestCore"

function getTurn(core: ReturnType<typeof makeTestCore>, turnId: string) {
  return core.activeChannel.value?.sourceTranslation.getTurn(turnId)
}

describe("switchTurnSpeaker", () => {
  it("reassigns the turn to the new speaker", () => {
    const core = makeTestCore()
    switchTurnSpeaker(core, "turn-1", "spk-2")
    expect(getTurn(core, "turn-1")?.speakerId).toBe("spk-2")
  })

  it("leaves other turns untouched", () => {
    const core = makeTestCore()
    switchTurnSpeaker(core, "turn-1", "spk-2")
    expect(getTurn(core, "turn-3")?.speakerId).toBe("spk-1")
  })

  it("ignores unknown turn ids", () => {
    const core = makeTestCore()
    switchTurnSpeaker(core, "turn-404", "spk-2")
    expect(getTurn(core, "turn-1")?.speakerId).toBe("spk-1")
  })
})
