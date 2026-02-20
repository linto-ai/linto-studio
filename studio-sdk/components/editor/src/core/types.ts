import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { Channel, EditorDocument, Turn, Speaker, Word } from '../types/editor'

// ── Capabilities ────────────────────────────────────────────────────────

export interface EditorCapabilities {
  text: 'edit' | 'view'
  speakers: 'edit' | 'view'
}

// ── Event Map ──────────────────────────────────────────────────────────

export interface EditorEventMap {
  'channel:change': { channelId: string }
  'language:change': { language: string | null }
  'turn:add': { turn: Turn }
  'turn:update': { turn: Turn }
  'turn:remove': { turnId: string }
  'speaker:update': { speaker: Speaker }
  'speaker:add': { speaker: Speaker }
  'partial:set': { turnId: string; text: string }
  'partial:clear': { turnId: string }
  'partials:clear-all': void
  'destroy': void
}

// ── Plugin ─────────────────────────────────────────────────────────────

export interface EditorPlugin {
  name: string
  install(editor: EditorCore): (() => void) | void
}

// ── Core Options ───────────────────────────────────────────────────────

export interface EditorCoreOptions {
  channels?: Channel[]
  activeChannelId?: string
  capabilities?: EditorCapabilities
}

// ── Core ───────────────────────────────────────────────────────────────

export interface EditorCore {
  // ── State (readonly) ───────────────────────────────────────────────
  channels: Ref<Channel[]>
  activeChannelId: Ref<string>
  selectedLanguage: Ref<string | null>
  partials: ShallowRef<Map<string, string>>
  capabilities: Ref<EditorCapabilities>

  // ── Computed ───────────────────────────────────────────────────────
  activeChannel: ComputedRef<Channel>
  activeDocument: ComputedRef<EditorDocument>
  activeTurns: ComputedRef<Turn[]>
  activeLanguageCode: ComputedRef<string>
  availableLanguages: ComputedRef<string[]>

  // ── Channel / Language ─────────────────────────────────────────────
  setChannels(channels: Channel[]): void
  setActiveChannel(channelId: string): void
  setActiveLanguage(language: string | null): void

  // ── Turns ──────────────────────────────────────────────────────────
  addTurn(turn: Turn): void
  updateTurn(turnId: string, patch: Partial<Turn>): void
  removeTurn(turnId: string): void
  updateWords(turnId: string, words: Word[]): void

  // ── Speakers ───────────────────────────────────────────────────────
  ensureSpeaker(speakerId: string): void
  updateSpeaker(speakerId: string, patch: Partial<Omit<Speaker, 'id'>>): void

  // ── Partials ───────────────────────────────────────────────────────
  setPartial(turnId: string, text: string): void
  clearPartial(turnId: string): void
  clearAllPartials(): void

  // ── Events ─────────────────────────────────────────────────────────
  on<K extends keyof EditorEventMap>(
    event: K,
    handler: (payload: EditorEventMap[K]) => void,
  ): () => void
  off<K extends keyof EditorEventMap>(
    event: K,
    handler: (payload: EditorEventMap[K]) => void,
  ): void
  emit<K extends keyof EditorEventMap>(
    event: K,
    payload: EditorEventMap[K],
  ): void

  // ── Plugins ────────────────────────────────────────────────────────
  use(plugin: EditorPlugin): void
  destroy(): void
}
