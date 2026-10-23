import { describe, expect, it } from "bun:test"
import { createCore } from "@linto-ai/transcript-ui-core"
import type { Core } from "@linto-ai/transcript-ui-core"
import { createLivePlugin } from "../index"
import type { LivePluginOptions } from "../index"

/** One channel, a French source and an English translation track — enough
 *  for both partial paths (source, and translated/cross). Tracks are keyed
 *  by language, as live hosts do: final translations look them up that way. */
function makeLiveCore(options: LivePluginOptions = {}): Core {
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
          { id: "fr", languages: ["fr"], isSource: true, turns: [] },
          { id: "en", languages: ["en"], isSource: false, turns: [] },
        ],
      },
    ],
  })
  core.use(createLivePlugin(options))
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

  it("starts hidden when the host asks for it", () => {
    const core = makeLiveCore({ partialsVisible: false })

    expect(core.live!.partialsVisible.value).toBe(false)

    sendPartial(core, "bonjour le")
    expect(core.live!.partial.value).toBeNull()
  })

  it("announces every toggle so the host can remember it", () => {
    const core = makeLiveCore()
    const seen: boolean[] = []
    core.on("partials:visible", ({ visible }) => seen.push(visible))

    core.live!.hidePartials()
    core.live!.showPartials()

    expect(seen).toEqual([false, true])
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
    core.activeChannel.value!.setActiveTranslation("en")

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
    const core = makeLiveCore({ silenceDelay: 30 })

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
    const core = makeLiveCore({ silenceDelay: 30 })
    core.live!.hidePartials()

    sendPartial(core, "bonjour")
    expect(core.live!.partial.value).toBeNull()
    expect(core.live!.isSpeechActive.value).toBe(true)

    await wait(50)
    expect(core.live!.isSpeechActive.value).toBe(false)
  })

  it("counts translated partials as speech too", () => {
    const core = makeLiveCore({ silenceDelay: 30 })
    core.activeChannel.value!.setActiveTranslation("en")

    sendTranslatedPartial(core, "hello")
    expect(core.live!.isSpeechActive.value).toBe(true)
  })

  it("defaults to a two-second delay, host-tunable at runtime", () => {
    expect(makeLiveCore().live!.silenceDelay.value).toBe(6000)
    expect(makeLiveCore({ silenceDelay: 500 }).live!.silenceDelay.value).toBe(500)
  })
})

function sendFinal(
  core: Core,
  speakerId: string | null,
  speakerDefined?: boolean,
): void {
  core.live!.onFinal(
    {
      turnId: `turn-${Math.random()}`,
      speakerId,
      ...(speakerDefined !== undefined ? { speakerDefined } : {}),
      text: "bonjour",
      words: [],
      startTime: 0,
      endTime: 1,
      language: "fr",
    },
    "ch-1",
  )
}

describe("createLivePlugin — speaker placeholder flag", () => {
  it("creates a placeholder speaker from a generic locutor", () => {
    const core = makeLiveCore()
    sendFinal(core, "Guest-1", false)

    const speaker = core.speakers.all.get("Guest-1")
    expect(speaker?.name).toBe("Guest-1")
    expect(speaker?.defined).toBe(false)
  })

  it("leaves the flag out when the event does not carry it", () => {
    const core = makeLiveCore()
    sendFinal(core, "Alice")

    const speaker = core.speakers.all.get("Alice")
    expect(speaker?.name).toBe("Alice")
    expect(speaker).not.toHaveProperty("defined")
  })

  it("flags a speaker first created by a translated turn", () => {
    const core = makeLiveCore()
    core.live!.onTranslation({
      turnId: "turn-1",
      language: "en",
      sourceLanguage: "fr",
      text: "hello",
      final: true,
      startTime: 0,
      endTime: 1,
      speakerId: "spk_1",
    })
    expect(core.speakers.all.has("spk_1")).toBe(true)
    expect(core.speakers.all.get("spk_1")).not.toHaveProperty("defined")

    sendFinal(core, "spk_1", false)
    expect(core.speakers.all.get("spk_1")?.defined).toBe(false)
  })

  it("carries the flag of a final translation event", () => {
    const core = makeLiveCore()
    core.live!.onTranslation({
      turnId: "turn-1",
      language: "en",
      sourceLanguage: "fr",
      text: "hello",
      final: true,
      startTime: 0,
      endTime: 1,
      speakerId: "Guest-2",
      speakerDefined: false,
    })
    expect(core.speakers.all.get("Guest-2")?.defined).toBe(false)
  })

  it("keeps a renamed speaker's name over a later placeholder flag", () => {
    const core = makeLiveCore()
    sendFinal(core, "Guest-1", false)
    core.speakers.update("Guest-1", { name: "Alice", defined: true })

    sendFinal(core, "Guest-1", false)
    expect(core.speakers.all.get("Guest-1")?.defined).toBe(true)
  })

  it("flags speakers of a history batch", () => {
    const core = makeLiveCore()
    core.live!.prependFinalBatch(
      [
        {
          turnId: "turn-1",
          speakerId: "spk_0",
          speakerDefined: false,
          text: "bonjour",
          words: [],
          startTime: 0,
          endTime: 1,
          language: "fr",
        },
        {
          turnId: "turn-2",
          speakerId: "Bob",
          speakerDefined: true,
          text: "salut",
          words: [],
          startTime: 1,
          endTime: 2,
          language: "fr",
        },
      ],
      "ch-1",
    )

    expect(core.speakers.all.get("spk_0")?.defined).toBe(false)
    expect(core.speakers.all.get("Bob")?.defined).toBe(true)
  })
})
