import { describe, expect, it } from "bun:test"
import { createCore } from "@linto-ai/transcript-ui-core"
import type { Core } from "@linto-ai/transcript-ui-core"
import { createLivePlugin } from "../index"

/** One channel, a French source and an English translation track — enough
 *  for both partial paths (source, and translated/cross). */
function makeLiveCore(silenceDelay?: number): Core {
  const core = createCore()
  core.setDocument({
    title: "live",
    speakers: new Map(),
    channels: [
      {
        id: "ch-1",
        name: "channel 1",
        duration: 0,
        translations: [
          { id: "tr-fr", languages: ["fr"], isSource: true, turns: [] },
          { id: "tr-en", languages: ["en"], isSource: false, turns: [] },
        ],
      },
    ],
  })
  core.use(createLivePlugin(silenceDelay ? { silenceDelay } : {}))
  return core
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function sendPartial(core: Core, text: string): void {
  core.live!.onPartial({ turnId: "turn-1", text, language: "fr" }, "ch-1")
}

function sendTranslatedPartial(core: Core, text: string): void {
  core.live!.onTranslation({
    turnId: "turn-1",
    language: "en",
    sourceLanguage: "fr",
    text,
    final: false,
    startTime: 0,
    endTime: 1,
    speakerId: null,
  })
}

describe("createLivePlugin — partials visibility", () => {
  it("shows partials by default", () => {
    const core = makeLiveCore()

    expect(core.live!.partialsVisible.value).toBe(true)

    sendPartial(core, "bonjour le")
    expect(core.live!.partial.value).toBe("bonjour le")
  })

  it("drops what is on screen and swallows the next ones once hidden", () => {
    const core = makeLiveCore()
    sendPartial(core, "bonjour le")

    core.live!.hidePartials()
    expect(core.live!.partialsVisible.value).toBe(false)
    expect(core.live!.partial.value).toBeNull()

    sendPartial(core, "bonjour le monde")
    expect(core.live!.partial.value).toBeNull()
  })

  it("lets them through again when shown back", () => {
    const core = makeLiveCore()
    core.live!.hidePartials()
    sendPartial(core, "swallowed")

    core.live!.showPartials()
    expect(core.live!.partialsVisible.value).toBe(true)

    sendPartial(core, "bonjour")
    expect(core.live!.partial.value).toBe("bonjour")
  })

  it("gates translated partials too, not just the source ones", () => {
    const core = makeLiveCore()
    core.activeChannel.value!.setActiveTranslation("tr-en")

    sendTranslatedPartial(core, "hello the")
    expect(core.live!.partial.value).toBe("hello the")

    core.live!.hidePartials()
    expect(core.live!.partial.value).toBeNull()

    sendTranslatedPartial(core, "hello the world")
    expect(core.live!.partial.value).toBeNull()
  })

  it("still records finalized turns while partials are hidden", () => {
    const core = makeLiveCore()
    core.live!.hidePartials()

    core.live!.onFinal(
      {
        turnId: "turn-1",
        speakerId: null,
        text: "bonjour le monde",
        words: [],
        startTime: 0,
        endTime: 2,
        language: "fr",
      },
      "ch-1",
    )

    const turns = core.activeChannel.value!.sourceTranslation.turns.value
    expect(turns.map((t) => t.text)).toEqual(["bonjour le monde"])
    expect(core.live!.partial.value).toBeNull()
  })
})

describe("createLivePlugin — speech activity", () => {
  it("lights up on a partial and goes out after the silence delay", async () => {
    const core = makeLiveCore(30)

    expect(core.live!.isSpeechActive.value).toBe(false)

    sendPartial(core, "bonjour")
    expect(core.live!.isSpeechActive.value).toBe(true)

    await wait(15)
    // Still talking: each partial pushes the deadline back.
    sendPartial(core, "bonjour le")
    await wait(20)
    expect(core.live!.isSpeechActive.value).toBe(true)

    await wait(40)
    expect(core.live!.isSpeechActive.value).toBe(false)
  })

  it("tracks speech even while the partial text is hidden", async () => {
    const core = makeLiveCore(30)
    core.live!.hidePartials()

    sendPartial(core, "bonjour")
    expect(core.live!.partial.value).toBeNull()
    expect(core.live!.isSpeechActive.value).toBe(true)

    await wait(50)
    expect(core.live!.isSpeechActive.value).toBe(false)
  })

  it("counts translated partials as speech too", () => {
    const core = makeLiveCore(30)
    core.activeChannel.value!.setActiveTranslation("tr-en")

    sendTranslatedPartial(core, "hello")
    expect(core.live!.isSpeechActive.value).toBe(true)
  })

  it("defaults to a two-second delay, host-tunable at runtime", () => {
    expect(makeLiveCore().live!.silenceDelay.value).toBe(2000)
    expect(makeLiveCore(500).live!.silenceDelay.value).toBe(500)
  })
})
