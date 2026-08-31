import { ref, computed, shallowReactive, type Component } from "vue"
import type { DownloadFormat } from "@linto-ai/transcript-ui-ui"
import type { Channel, EditorDocument } from "../types/editor"
import type {
  Core,
  CoreOptions,
  CoreEventMap,
  CoreCapabilities,
  CorePlugin,
  TurnEventKey,
  UISlot,
} from "./types"
import { createEventBus } from "./modules/eventBus"
import { createSpeakersStore } from "./stores/speakersStore"
import { createChannelStore } from "./stores/channelStore"
import type { ChannelStore } from "./types"
import { ensureDocumentSpeakers } from "./helpers/ensureDocumentSpeakers"
import { ensureSpeakersFromTurns } from "./helpers/ensureSpeakersFromTurns"
import * as utils from "../utils"

// No backend can generate this — it's just the turns joined into text — so
// it's the one format the core always offers and fulfills itself.
const DEFAULT_VERBATIM_FORMATS: DownloadFormat[] = [
  { format: "txt", labelKey: "format.txt" },
]

export function createCore(options: CoreOptions = {}): Core {
  // ── State ──────────────────────────────────────────────────────────

  const title = ref("")
  const date = ref<string | number | null>(null)
  const activeChannelId = ref(options.activeChannelId ?? "")
  const capabilities = ref<CoreCapabilities>(
    options.capabilities ?? { text: "edit", speakers: "edit" },
  )
  const verbatimFormatsAreDefault = options.verbatimFormats == null
  const verbatimFormats =
    options.verbatimFormats ?? DEFAULT_VERBATIM_FORMATS

  // ── Event bus ──────────────────────────────────────────────────────

  const { on, off, emit, clear: clearEvents } = createEventBus<CoreEventMap>()

  // ── Speakers ───────────────────────────────────────────────────────

  const speakersInternal = createSpeakersStore(emit)
  const speakers = speakersInternal

  // ── Channels ───────────────────────────────────────────────────────

  const channels = shallowReactive(new Map<string, ChannelStore>())

  // ── Plugin UI ──────────────────────────────────────────────────────

  const components = shallowReactive<Partial<Record<UISlot, Component>>>({})

  const activeChannel = computed<ChannelStore | undefined>(() =>
    channels.get(activeChannelId.value) ?? [...channels.values()][0],
  )

  // ── Scoped events ─────────────────────────────────────────────────

  function onActiveTranslation<K extends TurnEventKey>(
    event: K,
    handler: (payload: CoreEventMap[K]) => void,
  ): () => void {
    return on(event, (payload) => {
      const channel = activeChannel.value
      if (channel && payload.translationId === channel.activeTranslation.value.id) {
        handler(payload)
      }
    })
  }

  // ── Build from document ────────────────────────────────────────────

  function buildFromDocument(doc: EditorDocument): void {
    title.value = doc.title
    date.value = doc.date ?? null
    speakersInternal.clear()
    for (const channel of channels.values()) channel.dispose()
    channels.clear()

    for (const spkRef of ensureDocumentSpeakers(doc)) {
      speakers.ensure(spkRef.id, spkRef.name)
    }

    for (const ch of doc.channels) {
      channels.set(ch.id, createChannelStore(ch, emit, on, speakers.ensure))
    }

    if (channels.size > 0 && !channels.has(activeChannelId.value)) {
      activeChannelId.value = channels.keys().next().value!
    }
  }

  // ── Document ───────────────────────────────────────────────────────

  function setDocument(doc: EditorDocument): void {
    utils.validateEditorDocument(doc)
    buildFromDocument(doc)
    emit("document:change", undefined as never)
  }

  // ── Channel ────────────────────────────────────────────────────────

  function setActiveChannel(channelId: string): void {
    if (channelId === activeChannelId.value) return
    activeChannelId.value = channelId
    emit("channel:change", { channelId })
  }

  function setChannel(channelId: string, channel: Channel): void {
    if (!channels.has(channelId)) return

    for (const translation of channel.translations) {
      ensureSpeakersFromTurns(translation.turns, speakers.ensure)
    }

    channels.get(channelId)?.dispose()
    channels.set(channelId, createChannelStore(channel, emit, on, speakers.ensure))
    emit("channel:sync", { channelId })
  }

  // ── Plugins ────────────────────────────────────────────────────────

  const cleanups: Array<() => void> = []

  function use(plugin: CorePlugin): void {
    if (plugin.components) Object.assign(components, plugin.components)
    const cleanup = plugin.install(core)
    if (cleanup) cleanups.push(cleanup)
  }

  function destroy(): void {
    emit("destroy", undefined as never)
    cleanups.forEach((fn) => fn())
    cleanups.length = 0
    for (const channel of channels.values()) channel.dispose()
    clearEvents()
  }

  // ── Initial document ──────────────────────────────────────────────

  if (options.document) {
    buildFromDocument(options.document)
  }

  // ── Assemble ──────────────────────────────────────────────────────

  const core: Core = {
    title,
    date,
    activeChannelId,
    capabilities,
    verbatimFormats,
    verbatimFormatsAreDefault,
    speakers,
    channels,
    activeChannel,
    components,
    onActiveTranslation,
    setDocument,
    setActiveChannel,
    setChannel,
    on,
    off,
    emit,
    use,
    destroy,
  }

  return core
}
