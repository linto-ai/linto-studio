import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { Channel, EditorDocument, Translation, Turn, Speaker, Word } from '../types/editor'

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
  'partial:set': { text: string }
  'partial:clear': void
  'destroy': void
}

// ── Plugin ─────────────────────────────────────────────────────────────

export interface EditorPlugin {
  name: string
  install(editor: EditorCore): (() => void) | void
}

// ── Core Options ───────────────────────────────────────────────────────

export interface EditorCoreOptions {
  document?: EditorDocument
  activeChannelId?: string
  capabilities?: EditorCapabilities
}

// ── Core ───────────────────────────────────────────────────────────────

export interface EditorCore {
  // ── State (readonly) ───────────────────────────────────────────────
  document: Ref<EditorDocument>
  activeChannelId: Ref<string>
  selectedLanguage: Ref<string | null>
  partial: ShallowRef<string | null>
  capabilities: Ref<EditorCapabilities>

  // ── Computed ───────────────────────────────────────────────────────
  activeChannel: ComputedRef<Channel>
  activeTranslation: ComputedRef<Translation>
  activeTurns: ComputedRef<Turn[]>
  activeLanguageCode: ComputedRef<string>
  availableLanguages: ComputedRef<string[]>
  speakers: ComputedRef<Map<string, Speaker>>

  // ── Document ─────────────────────────────────────────────────────
  setDocument(doc: EditorDocument): void

  // ── Channel / Language ─────────────────────────────────────────────
  setActiveChannel(channelId: string): void
  setActiveLanguage(language: string | null): void

  // ── Turns ──────────────────────────────────────────────────────────
  addTurn(turn: Turn): void
  updateTurn(turnId: string, patch: Partial<Turn>): void
  removeTurn(turnId: string): void
  updateWords(turnId: string, words: Word[]): void

  // ── Speakers ───────────────────────────────────────────────────────
  ensureSpeaker(speakerId: string | null, name?: string): void
  updateSpeaker(speakerId: string, patch: Partial<Omit<Speaker, 'id'>>): void

  // ── Partials ───────────────────────────────────────────────────────
  setPartial(text: string): void
  clearPartial(): void

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
