import { ref, computed, shallowReactive } from "vue"
import type { Channel, EditorDocument } from "../types/editor"
import type {
  Core,
  CoreOptions,
  CoreEventMap,
  CoreCapabilities,
  CorePlugin,
  TurnEventKey,
} from "./types"
import { createEventBus } from "./modules/eventBus"
import { createSpeakersStore } from "./stores/speakersStore"
import { createChannelStore } from "./stores/channelStore"
import type { ChannelStore } from "./types"
import { ensureDocumentSpeakers } from "./helpers/ensureDocumentSpeakers"
import { ensureSpeakersFromTurns } from "./helpers/ensureSpeakersFromTurns"
import * as utils from "../utils"

export function createCore(options: CoreOptions = {}): Core {
  // ── State ──────────────────────────────────────────────────────────

  const title = ref("")
  const activeChannelId = ref(options.activeChannelId ?? "")
  const capabilities = ref<CoreCapabilities>(
    options.capabilities ?? { text: "edit", speakers: "edit" },
  )

  // ── Event bus ──────────────────────────────────────────────────────

  const { on, off, emit, clear: clearEvents } = createEventBus<CoreEventMap>()

  // ── Speakers ───────────────────────────────────────────────────────

  const speakersInternal = createSpeakersStore(emit)
  const speakers = speakersInternal

  // ── Channels ───────────────────────────────────────────────────────

  const channels = shallowReactive(new Map<string, ChannelStore>())

  const activeChannel = computed<ChannelStore>(() =>
    channels.get(activeChannelId.value) ?? [...channels.values()][0]!,
  )

  // ── Scoped events ─────────────────────────────────────────────────

  function onActiveTranslation<K extends TurnEventKey>(
    event: K,
    handler: (payload: CoreEventMap[K]) => void,
  ): () => void {
    return on(event, (payload) => {
      if (payload.translationId === activeChannel.value.activeTranslation.value.id) {
        handler(payload)
      }
    })
  }

  // ── Build from document ────────────────────────────────────────────

  function buildFromDocument(doc: EditorDocument): void {
    title.value = doc.title
    speakersInternal.clear()
    channels.clear()

    for (const spkRef of ensureDocumentSpeakers(doc)) {
      speakers.ensure(spkRef.id, spkRef.name)
    }

    for (const ch of doc.channels) {
      channels.set(ch.id, createChannelStore(ch, emit, speakers.ensure))
    }

    if (channels.size > 0 && !channels.has(activeChannelId.value)) {
      activeChannelId.value = channels.keys().next().value!
    }
  }

  // ── Document ───────────────────────────────────────────────────────

  function setDocument(doc: EditorDocument): void {
    utils.validateEditorDocument(doc)
    buildFromDocument(doc)
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

    channels.set(channelId, createChannelStore(channel, emit, speakers.ensure))
    emit("channel:sync", { channelId })
  }

  // ── Plugins ────────────────────────────────────────────────────────

  const cleanups: Array<() => void> = []
  const pluginExtensions: import("@tiptap/core").AnyExtension[] = []

  function use(plugin: CorePlugin): void {
    if (plugin.tiptapExtensions) {
      pluginExtensions.push(...plugin.tiptapExtensions)
    }
    const cleanup = plugin.install(core)
    if (cleanup) cleanups.push(cleanup)
  }

  function destroy(): void {
    emit("destroy", undefined as never)
    cleanups.forEach((fn) => fn())
    cleanups.length = 0
    clearEvents()
  }

  // ── Initial document ──────────────────────────────────────────────

  if (options.document) {
    buildFromDocument(options.document)
  }

  // ── Assemble ──────────────────────────────────────────────────────

  const core: Core = {
    title,
    activeChannelId,
    capabilities,
    pluginExtensions,
    speakers,
    channels,
    activeChannel,
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
