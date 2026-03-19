import type { ComputedRef, Ref, ShallowRef } from "vue"
import type {
  Channel,
  EditorDocument,
  Translation,
  Turn,
  Speaker,
  Word,
} from "../types/editor"

// ── Turn Target ─────────────────────────────────────────────────────────

export interface TurnTarget {
  channelId?: string
  translationId?: string
}

// ── Capabilities ────────────────────────────────────────────────────────

export interface EditorCapabilities {
  text: "edit" | "view"
  speakers: "edit" | "view"
}

// ── Event Map ──────────────────────────────────────────────────────────

export interface EditorEventMap {
  "channel:change": { channelId: string }
  "translation:change": { translationId: string | null }
  "turn:add": { turn: Turn }
  "turn:update": { turn: Turn }
  "turn:remove": { turnId: string }
  "speaker:update": { speaker: Speaker }
  "speaker:add": { speaker: Speaker }
  "translation:sync": { translationId: string }
  "channel:sync": { channelId: string }
  destroy: void
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

// ── Handles ─────────────────────────────────────────────────────────────

export interface TranslationHandle {
  data: ComputedRef<Translation>
  turns: ComputedRef<Turn[]>
  addTurn(turn: Turn): void
  updateTurn(turnId: string, patch: Partial<Turn>): void
  removeTurn(turnId: string): void
  updateWords(turnId: string, words: Word[]): void
  setTurns(turns: Turn[]): void
}

export interface ChannelHandle {
  data: ComputedRef<Channel>
  activeTranslation: TranslationHandle
  setActiveTranslation(translationId: string | null): void
}

export interface SpeakersHandle {
  all: ComputedRef<Map<string, Speaker>>
  ensure(speakerId: string | null, name?: string): void
  update(speakerId: string, patch: Partial<Omit<Speaker, "id">>): void
}

// ── Audio Plugin API ────────────────────────────────────────────────────

export interface AudioPluginApi {
  currentTime: Ref<number>
  isPlaying: Ref<boolean>
  src: ComputedRef<string | null>
  seekTo(time: number): void
  setSeekHandler(handler: ((time: number) => void) | null): void
}

// ── Subtitle Plugin API ──────────────────────────────────────────────────

export interface SubtitlePluginApi {
  fontSize: Ref<number>
  isVisible: Ref<boolean>
  isFullscreen: Ref<boolean>
  enterFullscreen(): void
  exitFullscreen(): void
}

// ── Live Plugin API ─────────────────────────────────────────────────────

export interface LivePluginApi {
  partial: ShallowRef<string | null>
  hasLiveUpdate: Ref<boolean>
  onPartial(event: { text: string }, channelId: string): void
  onFinal(event: {
    turnId: string
    speakerId: string | null
    text: string
    words: Array<{
      id: string
      text: string
      startTime?: number
      endTime?: number
      confidence?: number
    }>
    startTime: number
    endTime: number
    language: string
  }, channelId: string): void
  onTranslation(event: { turnId: string; language: string; text: string }): void
}

// ── Core ───────────────────────────────────────────────────────────────

export interface EditorCore {
  // ── State ────────────────────────────────────────────────────────────
  document: Ref<EditorDocument>
  activeChannelId: Ref<string>
  capabilities: Ref<EditorCapabilities>

  // ── Handles ──────────────────────────────────────────────────────────
  activeChannel: ChannelHandle
  speakers: SpeakersHandle

  // ── Navigation ───────────────────────────────────────────────────────
  setDocument(doc: EditorDocument): void
  setActiveChannel(channelId: string): void
  setChannel(channelId: string, channel: Channel): void
  withTranslation(target?: TurnTarget): TranslationHandle | null

  // ── Plugin slots ─────────────────────────────────────────────────────
  audio?: AudioPluginApi
  live?: LivePluginApi
  subtitle?: SubtitlePluginApi

  // ── Events ───────────────────────────────────────────────────────────
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

  // ── Plugins ──────────────────────────────────────────────────────────
  use(plugin: EditorPlugin): void
  destroy(): void
}
