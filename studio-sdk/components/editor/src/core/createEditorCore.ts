import { ref, computed, shallowRef, triggerRef } from "vue"
import type { EditorDocument, Turn, Speaker, Word } from "../types/editor"
import type {
  EditorCore,
  EditorCoreOptions,
  EditorEventMap,
  EditorCapabilities,
  EditorPlugin,
} from "./types"
import { SPEAKER_COLORS } from "../constants/speakers"
import { validateEditorDocument } from "../utils/validateDocument"

type EventHandler<K extends keyof EditorEventMap> = (
  payload: EditorEventMap[K],
) => void
type AnyHandler = (payload: never) => void

const emptyDocument: EditorDocument = {
  title: "",
  speakers: new Map(),
  channels: [],
}

export function createEditorCore(options: EditorCoreOptions = {}): EditorCore {
  // ── State ──────────────────────────────────────────────────────────

  const document = ref<EditorDocument>(options.document ?? emptyDocument)
  const activeChannelId = ref(options.activeChannelId ?? "")
  const selectedLanguage = ref<string | null>(null)
  const partial = shallowRef<string | null>(null)
  const capabilities = ref<EditorCapabilities>(
    options.capabilities ?? { text: "edit", speakers: "edit" },
  )

  // ── Computed ───────────────────────────────────────────────────────

  const activeChannel = computed(
    () =>
      document.value.channels.find((c) => c.id === activeChannelId.value) ??
      document.value.channels[0]!,
  )

  const sourceTranslation = computed(
    () =>
      activeChannel.value.translations.find((t) => t.isSource) ??
      activeChannel.value.translations[0]!,
  )

  const activeTranslation = computed(() => {
    if (!selectedLanguage.value) return sourceTranslation.value
    const tr = activeChannel.value.translations.find((t) =>
      t.languages.includes(selectedLanguage.value!),
    )
    return tr ?? sourceTranslation.value
  })

  const activeTurns = computed(() => activeTranslation.value.turns)

  const activeLanguageCode = computed(
    () => selectedLanguage.value ?? sourceTranslation.value.languages[0]!,
  )

  const availableLanguages = computed(() => {
    const langs: string[] = []
    for (const tr of activeChannel.value.translations) {
      for (const lang of tr.languages) {
        if (!langs.includes(lang)) langs.push(lang)
      }
    }
    return langs
  })

  const speakers = computed(() => document.value.speakers)

  // ── Event Bus ──────────────────────────────────────────────────────

  const listeners = new Map<keyof EditorEventMap, Set<AnyHandler>>()

  function on<K extends keyof EditorEventMap>(
    event: K,
    handler: EventHandler<K>,
  ): () => void {
    let set = listeners.get(event)
    if (!set) {
      set = new Set()
      listeners.set(event, set)
    }
    set.add(handler as AnyHandler)
    return () => off(event, handler)
  }

  function off<K extends keyof EditorEventMap>(
    event: K,
    handler: EventHandler<K>,
  ): void {
    listeners.get(event)?.delete(handler as AnyHandler)
  }

  function emit<K extends keyof EditorEventMap>(
    event: K,
    payload: EditorEventMap[K],
  ): void {
    listeners.get(event)?.forEach((h) => (h as EventHandler<K>)(payload))
  }

  // ── Document ─────────────────────────────────────────────────────

  function ensureDocumentSpeakers(doc: EditorDocument): void {
    for (const [id, speaker] of doc.speakers) {
      ensureSpeaker(id, speaker.name)
    }
    for (const channel of doc.channels) {
      for (const translation of channel.translations) {
        for (const turn of translation.turns) {
          ensureSpeaker(turn.speakerId)
        }
      }
    }
  }

  function setDocument(doc: EditorDocument): void {
    validateEditorDocument(doc)
    document.value = { ...doc, speakers: new Map() }
    ensureDocumentSpeakers(doc)
    if (
      doc.channels.length > 0 &&
      !doc.channels.some((c) => c.id === activeChannelId.value)
    ) {
      activeChannelId.value = doc.channels[0]!.id
    }

    selectedLanguage.value = null
    clearPartial()
  }

  // ── Channel / Language ─────────────────────────────────────────────

  function setActiveChannel(channelId: string): void {
    if (channelId === activeChannelId.value) return
    activeChannelId.value = channelId
    selectedLanguage.value = null
    clearPartial()
    emit("channel:change", { channelId })
  }

  function setActiveLanguage(language: string | null): void {
    const isSource = sourceTranslation.value.languages.includes(language ?? "")
    selectedLanguage.value = isSource ? null : language
    emit("language:change", { language: selectedLanguage.value })
  }

  // ── Turn Mutations ─────────────────────────────────────────────────

  function findTurnIndex(turnId: string): number {
    return activeTranslation.value.turns.findIndex((t) => t.id === turnId)
  }

  function addTurn(turn: Turn): void {
    ensureSpeaker(turn.speakerId)
    const translation = activeTranslation.value
    translation.turns = [...translation.turns, turn]
    emit("turn:add", { turn })
  }

  function updateTurn(turnId: string, patch: Partial<Turn>): void {
    const idx = findTurnIndex(turnId)
    if (idx === -1) return
    const translation = activeTranslation.value
    const updated = { ...translation.turns[idx]!, ...patch, id: turnId }
    translation.turns = translation.turns.map((t, i) => (i === idx ? updated : t))
    emit("turn:update", { turn: updated })
  }

  function removeTurn(turnId: string): void {
    const idx = findTurnIndex(turnId)
    if (idx === -1) return
    const translation = activeTranslation.value
    translation.turns = translation.turns.filter((_, i) => i !== idx)
    emit("turn:remove", { turnId })
  }

  function updateWords(turnId: string, words: Word[]): void {
    const idx = findTurnIndex(turnId)
    if (idx === -1) return
    const translation = activeTranslation.value
    const turn = translation.turns[idx]!
    const updated = {
      ...turn,
      words,
      text: null,
      startTime: words[0]?.startTime ?? turn.startTime,
      endTime: words[words.length - 1]?.endTime ?? turn.endTime,
    }
    translation.turns = translation.turns.map((t, i) => (i === idx ? updated : t))
    emit("turn:update", { turn: updated })
  }

  // ── Speaker Mutations ──────────────────────────────────────────────

  function nextSpeakerColor(): string {
    return SPEAKER_COLORS[document.value.speakers.size % SPEAKER_COLORS.length]!
  }

  function addSpeaker(speaker: { id: string; name: string }): void {
    const full: Speaker = {
      id: speaker.id,
      name: speaker.name,
      color: nextSpeakerColor(),
    }
    document.value.speakers.set(full.id, full)
    emit("speaker:add", { speaker: full })
  }

  function ensureSpeaker(speakerId: string | null, name?: string): void {
    if (!speakerId) return
    if (document.value.speakers.has(speakerId)) return
    addSpeaker({ id: speakerId, name: name ?? speakerId })
  }

  function updateSpeaker(
    speakerId: string,
    patch: Partial<Omit<Speaker, "id">>,
  ): void {
    const existing = document.value.speakers.get(speakerId)
    if (!existing) return
    const updated = { ...existing, ...patch }
    document.value.speakers.set(speakerId, updated)
    emit("speaker:update", { speaker: updated })
  }

  // ── Partials ───────────────────────────────────────────────────────

  function setPartial(text: string): void {
    partial.value = text
    triggerRef(partial)
    emit("partial:set", { text })
  }

  function clearPartial(): void {
    if (partial.value === null) return
    partial.value = null
    triggerRef(partial)
    emit("partial:clear", undefined as never)
  }

  // ── Plugin Lifecycle ───────────────────────────────────────────────

  const cleanups: Array<() => void> = []

  function use(plugin: EditorPlugin): void {
    const cleanup = plugin.install(core)
    if (cleanup) cleanups.push(cleanup)
  }

  function destroy(): void {
    emit("destroy", undefined as never)
    cleanups.forEach((fn) => fn())
    cleanups.length = 0
    listeners.clear()
  }

  // ── Assemble ───────────────────────────────────────────────────────

  const core: EditorCore = {
    // State
    document,
    activeChannelId,
    selectedLanguage,
    partial,
    capabilities,
    // Computed
    activeChannel,
    activeTranslation,
    activeTurns,
    activeLanguageCode,
    availableLanguages,
    speakers,
    // Document
    setDocument,
    // Channel / Language
    setActiveChannel,
    setActiveLanguage,
    // Turns
    addTurn,
    updateTurn,
    removeTurn,
    updateWords,
    // Speakers
    ensureSpeaker,
    updateSpeaker,
    // Partials
    setPartial,
    clearPartial,
    // Events
    on,
    off,
    emit,
    // Plugins
    use,
    destroy,
  }

  return core
}
