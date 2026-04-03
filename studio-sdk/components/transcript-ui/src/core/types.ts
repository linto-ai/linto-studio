import type { ComputedRef, Ref, ShallowRef } from "vue"
import type { AnyExtension } from "@tiptap/core"
import type {
  AudioSource,
  Channel,
  EditorDocument,
  Speaker,
  Turn,
  Word,
} from "../types/editor"

// ── Capabilities ────────────────────────────────────────────────────────

export interface CoreCapabilities {
  text: "edit" | "view"
  speakers: "edit" | "view"
}

// ── Event Map ──────────────────────────────────────────────────────────

export interface CoreEventMap {
  "channel:change": { channelId: string }
  "translation:change": { translationId: string | null }
  "turn:add": { turn: Turn; translationId: string }
  "turn:update": { turn: Turn; translationId: string }
  "turn:remove": { turnId: string; translationId: string }
  "speaker:update": { speaker: Speaker }
  "speaker:add": { speaker: Speaker }
  "scroll:top": { translationId: string }
  "translation:sync": { translationId: string }
  "channel:sync": { channelId: string }
  "channel:reset": { channelId: string }
  destroy: void
}

export type TurnEventKey = "turn:add" | "turn:update" | "turn:remove"

// ── Stores ─────────────────────────────────────────────────────────────

export interface TranslationStore {
  readonly id: string
  readonly languages: string[]
  readonly isSource: boolean
  readonly audio?: AudioSource
  readonly turns: Ref<Turn[]>
  addTurn(turn: Turn): void
  prependTurns(turns: Turn[]): void
  updateTurn(turnId: string, patch: Partial<Turn>): void
  removeTurn(turnId: string): void
  updateWords(turnId: string, words: Word[]): void
  setTurns(turns: Turn[]): void
}

export interface ChannelStore {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly duration: number
  readonly translations: Map<string, TranslationStore>
  readonly sourceTranslation: TranslationStore
  readonly activeTranslation: ComputedRef<TranslationStore>
  readonly isLoadingHistory: Ref<boolean>
  readonly hasMoreHistory: Ref<boolean>
  setActiveTranslation(translationId: string | null): void
  reset(): void
}

export interface SpeakersStore {
  readonly all: Map<string, Speaker>
  ensure(speakerId: string | null, name?: string): void
  update(speakerId: string, patch: Partial<Omit<Speaker, "id">>): void
}

// ── Plugin ─────────────────────────────────────────────────────────────

export interface CorePlugin {
  name: string
  install(core: Core): (() => void) | void
  /** TipTap extensions contributed by this plugin (e.g. Collaboration, CollaborationCursor) */
  tiptapExtensions?: AnyExtension[]
}

// ── Store Options ───────────────────────────────────────────────────────

export interface CoreOptions {
  document?: EditorDocument
  activeChannelId?: string
  capabilities?: CoreCapabilities
}

// ── Audio Plugin API ────────────────────────────────────────────────────

export interface AudioPluginApi {
  currentTime: Ref<number>
  isPlaying: Ref<boolean>
  src: ComputedRef<string | null>
  seekTo(time: number): void
  setSeekHandler(handler: ((time: number) => void) | null): void
}

// ── Transcription Editor Plugin API (TipTap rich-text editing) ──────────

export interface YjsUser {
  clientId: number
  [key: string]: unknown
}

export interface TranscriptionEditorPluginApi {
  readonly tiptapEditor: ShallowRef<import("@tiptap/vue-3").Editor | undefined>
  readonly doc: import("yjs").Doc
  readonly fragment: import("yjs").XmlFragment
  readonly users: Ref<YjsUser[]>
  readonly isConnected: Ref<boolean>
  updateUser(attrs: Record<string, unknown>): void
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

export interface LivePartialEventData {
  text?: string
  translations?: Array<{
    translationId: string
    text: string
  }>
}

export interface LiveFinalEventData {
  turnId: string
  speakerId: string | null
  text?: string
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
  translations?: Array<{
    translationId: string
    text: string
    language: string
  }>
}

export interface LivePluginApi {
  partial: ShallowRef<string | null>
  hasLiveUpdate: Ref<boolean>
  onPartial(event: LivePartialEventData, channelId: string): void
  onFinal(event: LiveFinalEventData, channelId: string): void
  prependFinal(event: LiveFinalEventData, channelId: string): void
  prependFinalBatch(events: LiveFinalEventData[], channelId: string): void
  onTranslation(event: { turnId: string; language: string; text: string }): void
}

// ── Core ────────────────────────────────────────────────────────────────

export interface Core {
  // ── State ────────────────────────────────────────────────────────────
  readonly title: Ref<string>
  readonly activeChannelId: Ref<string>
  readonly capabilities: Ref<CoreCapabilities>
  /** TipTap extensions collected from all plugins */
  readonly pluginExtensions: AnyExtension[]

  // ── Stores ───────────────────────────────────────────────────────────
  readonly speakers: SpeakersStore
  readonly channels: Map<string, ChannelStore>
  readonly activeChannel: ComputedRef<ChannelStore | undefined>

  // ── Navigation ───────────────────────────────────────────────────────
  setDocument(doc: EditorDocument): void
  setActiveChannel(channelId: string): void
  setChannel(channelId: string, channel: Channel): void

  // ── Scoped events ────────────────────────────────────────────────────
  onActiveTranslation<K extends TurnEventKey>(
    event: K,
    handler: (payload: CoreEventMap[K]) => void,
  ): () => void

  // ── Plugin slots ─────────────────────────────────────────────────────
  audio?: AudioPluginApi
  transcriptionEditor?: TranscriptionEditorPluginApi
  live?: LivePluginApi
  subtitle?: SubtitlePluginApi

  // ── Events ───────────────────────────────────────────────────────────
  on<K extends keyof CoreEventMap>(
    event: K,
    handler: (payload: CoreEventMap[K]) => void,
  ): () => void
  off<K extends keyof CoreEventMap>(
    event: K,
    handler: (payload: CoreEventMap[K]) => void,
  ): void
  emit<K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]): void

  // ── Plugins ──────────────────────────────────────────────────────────
  use(plugin: CorePlugin): void
  destroy(): void
}
