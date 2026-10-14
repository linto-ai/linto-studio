import { describe, expect, it } from "bun:test"
import { computed } from "vue"
import type { TranslationStore } from "@linto-ai/transcript-ui-core"
import { computeReportTrack } from "../computeReportTrack"

const source = { id: "source" } as TranslationStore
const english = { id: "english" } as TranslationStore

function buildChannel(activeId: string) {
  return {
    sourceTranslation: source,
    translations: new Map([
      [source.id, source],
      [english.id, english],
    ]),
    activeTranslation: computed(() => ({ id: activeId }) as TranslationStore),
  }
}

describe("computeReportTrack", () => {
  it("is the source track when it is displayed", () => {
    expect(computeReportTrack(buildChannel("source"))).toBe(source)
  })

  it("is the displayed translation track", () => {
    expect(computeReportTrack(buildChannel("english"))).toBe(english)
  })

  it("falls back on the source for the virtual cross view", () => {
    expect(computeReportTrack(buildChannel("cross"))).toBe(source)
  })
})
