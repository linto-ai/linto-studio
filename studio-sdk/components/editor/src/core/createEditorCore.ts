import { ref, computed } from "vue"
import type { EditorDocument } from "../types/editor"
import type {
  EditorCore,
  EditorCoreOptions,
  EditorEventMap,
  EditorCapabilities,
  EditorPlugin,
  TurnTarget,
  TranslationHandle,
} from "./types"
import { createEventBus } from "./modules/eventBus"
import { createSpeakersHandle } from "./handles/speakersHandle"
import { createChannelHandle } from "./handles/channelHandle"
import { createTranslationHandle } from "./handles/translationHandle"
import * as m from "./mutations"
import { validateEditorDocument } from "../utils/validateDocument"

const emptyDocument: EditorDocument = {
  title: "",
  speakers: new Map(),
  channels: [],
}

export function createEditorCore(options: EditorCoreOptions = {}): EditorCore {
  // ── State ──────────────────────────────────────────────────────────

  const document = ref<EditorDocument>(options.document ?? emptyDocument)
  const activeChannelId = ref(options.activeChannelId ?? "")
  const capabilities = ref<EditorCapabilities>(
    options.capabilities ?? { text: "edit", speakers: "edit" },
  )

  // ── Event bus ────────────────────────────────────────────────────────

  const { on, off, emit, clear } = createEventBus<EditorEventMap>()

  // ── Handles ──────────────────────────────────────────────────────────

  const activeChannelComputed = computed(() =>
    m.findChannel(document.value.channels, activeChannelId.value),
  )

  const speakers = createSpeakersHandle(document, emit)
  const activeChannel = createChannelHandle(activeChannelComputed, emit, speakers.ensure)

  // ── Document ─────────────────────────────────────────────────────────

  function setDocument(doc: EditorDocument): void {
    validateEditorDocument(doc)
    document.value = { ...doc, speakers: new Map() }

    for (const ref of m.ensureDocumentSpeakers(doc)) {
      speakers.ensure(ref.id, ref.name)
    }

    if (
      doc.channels.length > 0 &&
      !doc.channels.some((c) => c.id === activeChannelId.value)
    ) {
      activeChannelId.value = doc.channels[0]!.id
    }

    activeChannel.setActiveTranslation(null)
  }

  // ── Channel ──────────────────────────────────────────────────────────

  function setActiveChannel(channelId: string): void {
    if (channelId === activeChannelId.value) return
    activeChannelId.value = channelId
    emit("channel:change", { channelId })
  }

  // ── withTranslation ──────────────────────────────────────────────────

  function withTranslation(target?: TurnTarget): TranslationHandle | null {
    const translation = m.resolveTranslation(document.value, activeChannelComputed.value, target)
    if (!translation) return null
    return createTranslationHandle(() => translation, emit, speakers.ensure)
  }

  // ── Plugins ──────────────────────────────────────────────────────────

  const cleanups: Array<() => void> = []

  function use(plugin: EditorPlugin): void {
    const cleanup = plugin.install(core)
    if (cleanup) cleanups.push(cleanup)
  }

  function destroy(): void {
    emit("destroy", undefined as never)
    cleanups.forEach((fn) => fn())
    cleanups.length = 0
    clear()
  }

  // ── Assemble ─────────────────────────────────────────────────────────

  const core: EditorCore = {
    document,
    activeChannelId,
    capabilities,
    activeChannel,
    speakers,
    setDocument,
    setActiveChannel,
    withTranslation,
    on,
    off,
    emit,
    use,
    destroy,
  }

  return core
}
