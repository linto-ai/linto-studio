import { ref, computed, shallowReactive, watch, type Component } from "vue"
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
import { createViewport } from "./modules/viewport"
import { createSpeakersStore } from "./stores/speakersStore"
import { createChannelStore } from "./stores/channelStore"
import type { ChannelStore } from "./types"
import { ensureDocumentSpeakers } from "./helpers/ensureDocumentSpeakers"
import { ensureSpeakersFromTurns } from "./helpers/ensureSpeakersFromTurns"
import * as utils from "../utils"

/** 1.125rem, the --font-size-base the transcript used before it was tunable. */
const DEFAULT_TRANSCRIPT_FONT_SIZE = 18

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
  // Ref, not a plain array: unlike `document` (setDocument) or `capabilities`
  // (already a Ref), there is no dedicated setter, and no web component prop
  // either (an array can't cross an HTML attribute cleanly) — a host sets
  // this the same way it sets capabilities, core.verbatimFormats.value = […],
  // once it holds `core` (see TranscriptUI's defineExpose).
  const verbatimFormats = ref<DownloadFormat[]>(
    options.verbatimFormats ?? DEFAULT_VERBATIM_FORMATS,
  )
  const verbatimFormatsAreDefault = computed(
    () => verbatimFormats.value === DEFAULT_VERBATIM_FORMATS,
  )

  // ── Event bus ──────────────────────────────────────────────────────

  const { on, off, emit, clear: clearEvents } = createEventBus<CoreEventMap>()

  // ── Reading ────────────────────────────────────────────────────────

  const transcriptFontSize = ref(DEFAULT_TRANSCRIPT_FONT_SIZE)
  // Announced rather than stored: the editor keeps no preferences of its own
  // (it holds no storage at all), so a host that wants this to survive a
  // reload listens and restores it — the same deal as the watermark.
  const stopFontSizeSync = watch(transcriptFontSize, (fontSize) =>
    emit("transcript:fontSize", { fontSize }),
  )

  // ── Layout chrome ──────────────────────────────────────────────────

  // The core owns the media query rather than each component watching its
  // own: a host rendering its own header reads the same value the layout
  // switches on, and there is a single listener to release on destroy.
  const viewport = createViewport(onViewportChange)
  const sidebarOpen = ref(false)

  // Only the phone-width layout mounts the sidebar drawer, so "open" is
  // refused anywhere else instead of being stored: a host header that isn't
  // width-gated would otherwise leave the drawer armed and drop it on screen,
  // focus trapped, at the next resize below the breakpoint.
  function setSidebarOpen(open: boolean): void {
    if (open && !viewport.isMobile.value) return
    if (open === sidebarOpen.value) return
    sidebarOpen.value = open
    emit("sidebar:open", { open })
  }

  function onViewportChange(isMobile: boolean): void {
    emit("viewport:change", { isMobile })
    // Same invariant, the other way round: leaving phone width unmounts the
    // drawer, so the state can't keep claiming it is open.
    if (!isMobile) setSidebarOpen(false)
  }

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
    stopFontSizeSync()
    viewport.destroy()
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
    transcriptFontSize,
    isMobile: viewport.isMobile,
    sidebarOpen,
    setSidebarOpen,
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
