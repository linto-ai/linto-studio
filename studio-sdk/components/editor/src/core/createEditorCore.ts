import { ref, computed, shallowRef, triggerRef } from 'vue'
import type { Channel, Turn, Speaker, Word } from '../types/editor'
import { SPEAKER_COLORS } from '../constants/speakers'
import type {
  EditorCore,
  EditorCoreOptions,
  EditorEventMap,
  EditorCapabilities,
  EditorPlugin,
} from './types'

type EventHandler<K extends keyof EditorEventMap> = (payload: EditorEventMap[K]) => void
type AnyHandler = (payload: never) => void

export function createEditorCore(options: EditorCoreOptions = {}): EditorCore {
  // ── State ──────────────────────────────────────────────────────────

  const channels = ref<Channel[]>(options.channels ?? [])
  const activeChannelId = ref(options.activeChannelId ?? '')
  const selectedLanguage = ref<string | null>(null)
  const partials = shallowRef<Map<string, string>>(new Map())
  const capabilities = ref<EditorCapabilities>(
    options.capabilities ?? { text: 'edit', speakers: 'edit' },
  )

  // ── Computed ───────────────────────────────────────────────────────

  const activeChannel = computed(() =>
    channels.value.find(c => c.id === activeChannelId.value) ?? channels.value[0]!,
  )

  const activeDocument = computed(() => activeChannel.value.document)

  const activeLanguageCode = computed(() =>
    selectedLanguage.value ?? activeDocument.value.metadata.language,
  )

  const activeTurns = computed(() => {
    if (!selectedLanguage.value) return activeDocument.value.turns
    const tr = activeChannel.value.translations?.find(
      t => t.language === selectedLanguage.value,
    )
    return tr?.turns ?? activeDocument.value.turns
  })

  const availableLanguages = computed(() => {
    const original = activeDocument.value.metadata.language
    const extras = activeChannel.value.translations?.map(t => t.language) ?? []
    return [original, ...extras]
  })

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
    listeners.get(event)?.forEach(h => (h as EventHandler<K>)(payload))
  }

  // ── Channel / Language ─────────────────────────────────────────────

  function setChannels(newChannels: Channel[]): void {
    channels.value = newChannels
    if (newChannels.length > 0 && !newChannels.some(c => c.id === activeChannelId.value)) {
      activeChannelId.value = newChannels[0]!.id
    }
  }

  function setActiveChannel(channelId: string): void {
    if (channelId === activeChannelId.value) return
    activeChannelId.value = channelId
    selectedLanguage.value = null
    clearAllPartials()
    emit('channel:change', { channelId })
  }

  function setActiveLanguage(language: string | null): void {
    const isOriginal = language === activeDocument.value.metadata.language
    selectedLanguage.value = isOriginal ? null : language
    emit('language:change', { language: selectedLanguage.value })
  }

  // ── Turn Mutations ─────────────────────────────────────────────────

  function findTurnIndex(turnId: string): number {
    return activeDocument.value.turns.findIndex(t => t.id === turnId)
  }

  function addTurn(turn: Turn): void {
    activeDocument.value.turns.push(turn)
    emit('turn:add', { turn })
  }

  function updateTurn(turnId: string, patch: Partial<Turn>): void {
    const idx = findTurnIndex(turnId)
    if (idx === -1) return
    const turns = activeDocument.value.turns
    turns[idx] = { ...turns[idx]!, ...patch, id: turnId }
    emit('turn:update', { turn: turns[idx]! })
  }

  function removeTurn(turnId: string): void {
    const idx = findTurnIndex(turnId)
    if (idx === -1) return
    activeDocument.value.turns.splice(idx, 1)
    emit('turn:remove', { turnId })
  }

  function updateWords(turnId: string, words: Word[]): void {
    const idx = findTurnIndex(turnId)
    if (idx === -1) return
    const turns = activeDocument.value.turns
    const turn = turns[idx]!
    turns[idx] = {
      ...turn,
      words,
      text: words.map(w => w.text).join(' '),
      startTime: words[0]?.startTime ?? turn.startTime,
      endTime: words[words.length - 1]?.endTime ?? turn.endTime,
    }
    emit('turn:update', { turn: turns[idx]! })
  }

  // ── Speaker Mutations ──────────────────────────────────────────────

  function addSpeaker(speaker: { id: string; name: string; color?: string }): void {
    const color = speaker.color
      ?? SPEAKER_COLORS[activeDocument.value.speakers.size % SPEAKER_COLORS.length]!
    const full: Speaker = { id: speaker.id, name: speaker.name, color }
    activeDocument.value.speakers.set(full.id, full)
    emit('speaker:add', { speaker: full })
  }

  function ensureSpeaker(speakerId: string): void {
    if (activeDocument.value.speakers.has(speakerId)) return
    addSpeaker({ id: speakerId, name: speakerId })
  }

  function updateSpeaker(speakerId: string, patch: Partial<Omit<Speaker, 'id'>>): void {
    const existing = activeDocument.value.speakers.get(speakerId)
    if (!existing) return
    const updated = { ...existing, ...patch }
    activeDocument.value.speakers.set(speakerId, updated)
    emit('speaker:update', { speaker: updated })
  }

  // ── Partials ───────────────────────────────────────────────────────

  function setPartial(turnId: string, text: string): void {
    partials.value.set(turnId, text)
    triggerRef(partials)
    emit('partial:set', { turnId, text })
  }

  function clearPartial(turnId: string): void {
    if (!partials.value.has(turnId)) return
    partials.value.delete(turnId)
    triggerRef(partials)
    emit('partial:clear', { turnId })
  }

  function clearAllPartials(): void {
    if (partials.value.size === 0) return
    partials.value.clear()
    triggerRef(partials)
    emit('partials:clear-all', undefined as never)
  }

  // ── Plugin Lifecycle ───────────────────────────────────────────────

  const cleanups: Array<() => void> = []

  function use(plugin: EditorPlugin): void {
    const cleanup = plugin.install(core)
    if (cleanup) cleanups.push(cleanup)
  }

  function destroy(): void {
    emit('destroy', undefined as never)
    cleanups.forEach(fn => fn())
    cleanups.length = 0
    listeners.clear()
  }

  // ── Assemble ───────────────────────────────────────────────────────

  const core: EditorCore = {
    // State
    channels,
    activeChannelId,
    selectedLanguage,
    partials,
    capabilities,
    // Computed
    activeChannel,
    activeDocument,
    activeTurns,
    activeLanguageCode,
    availableLanguages,
    // Channel / Language
    setChannels,
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
    clearAllPartials,
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
