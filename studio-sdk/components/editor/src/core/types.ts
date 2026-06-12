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

export interface EditorCapabilities {
  text: "edit" | "view"
  speakers: "edit" | "view"
}

// ── Event Map ──────────────────────────────────────────────────────────

export interface EditorEventMap {
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
  "watermark:display": { display: boolean }
  "watermark:pin": { pinned: boolean }
  "subtitle:visible": { visible: boolean; height: number }
  destroy: void
}

export type TurnEventKey = "turn:add" | "turn:update" | "turn:remove"

// ── Stores ─────────────────────────────────────────────────────────────

/** Read-only surface of a translation — satisfied by both real and virtual stores. */
export interface ReadableTranslation {
  readonly id: string
  readonly languages: string[]
  readonly isSource: boolean
  readonly audio?: AudioSource
  readonly turns: Readonly<Ref<Turn[]>>
  getTurn(turnId: string): Turn | undefined
}

export interface TranslationStore extends ReadableTranslation {
  addTurn(turn: Turn): void
  prependTurns(turns: Turn[]): void
  updateTurn(turnId: string, patch: Partial<Turn>): void
  removeTurn(turnId: string): void
  updateWords(turnId: string, words: Word[]): void
  setTurns(turns: Turn[]): void
  replaceTurns(turns: Turn[]): void
  updateOrCreateTurnSilent(turn: Turn): void
  hasTurn(turnId: string): boolean
}

export interface ChannelStore {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly duration: number
  readonly translations: Map<string, TranslationStore>
  readonly sourceTranslation: TranslationStore
  /** Virtual bilingual "cross" translation, or null when not applicable. */
  readonly crossTranslation: ReadableTranslation | null
  /** Real tracks plus the cross entry when available — what the selector lists. */
  readonly selectableTranslations: ReadableTranslation[]
  readonly activeTranslation: ComputedRef<ReadableTranslation>
  readonly isLoadingHistory: Ref<boolean>
  readonly hasMoreHistory: Ref<boolean>
  setActiveTranslation(translationId: string | null): void
  reset(): void
  /** Detach internal subscriptions (e.g. the cross-translation relay). */
  dispose(): void
}

export interface SpeakersStore {
  readonly all: Map<string, Speaker>
  ensure(speakerId: string | null, name?: string): void
  update(speakerId: string, patch: Partial<Omit<Speaker, "id">>): void
}

// ── Plugin ─────────────────────────────────────────────────────────────

export interface EditorPlugin {
  name: string
  install(editor: EditorStore): (() => void) | void
  /** TipTap extensions contributed by this plugin (e.g. Collaboration, CollaborationCursor) */
  tiptapExtensions?: AnyExtension[]
}

// ── Store Options ───────────────────────────────────────────────────────

export interface EditorStoreOptions {
  document?: EditorDocument
  activeChannelId?: string
  capabilities?: EditorCapabilities
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

export interface WatermarkToken {
  src: string
  alt?: string
}

export interface WatermarkPluginApi {
  display: Ref<boolean>
  pinned: Ref<boolean>
  content: Ref<string>
  frequency: Ref<number>
  duration: Ref<number>
  tokens: Ref<Record<string, WatermarkToken>>
  readonly: boolean
}

export interface SubtitlePluginApi {
  fontSize: Ref<number>
  isVisible: Ref<boolean>
  isFullscreen: Ref<boolean>
  enterFullscreen(): void
  exitFullscreen(): void
  watermark?: WatermarkPluginApi
}

// ── Live Plugin API ─────────────────────────────────────────────────────

export interface LivePartialEventData {
  /** Segment this partial belongs to — used to match the opposite-language
   *  translation partial in cross mode. */
  turnId?: string
  text?: string
  language: string
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
  startDate?: number
  endDate?: number
  language: string
  translations?: Array<{
    translationId: string
    text: string
    language: string
  }>
}

export interface LiveTranslationEventData {
  turnId: string
  language: string
  /** Original language of the turn (the side being translated from). */
  sourceLanguage: string
  text: string
  final: boolean
  startTime: number
  endTime: number
  speakerId: string | null
}

export interface LivePluginApi {
  partial: ShallowRef<string | null>
  hasLiveUpdate: Ref<boolean>
  onPartial(event: LivePartialEventData, channelId: string): void
  onFinal(event: LiveFinalEventData, channelId: string): void
  prependFinal(event: LiveFinalEventData, channelId: string): void
  prependFinalBatch(events: LiveFinalEventData[], channelId: string): void
  onTranslation(event: LiveTranslationEventData): void
}

// ── Editor Store ────────────────────────────────────────────────────────

export interface EditorStore {
  // ── State ────────────────────────────────────────────────────────────
  readonly title: Ref<string>
  readonly activeChannelId: Ref<string>
  readonly capabilities: Ref<EditorCapabilities>
  /** TipTap extensions collected from all plugins */
  readonly pluginExtensions: AnyExtension[]

  // ── Stores ───────────────────────────────────────────────────────────
  readonly speakers: SpeakersStore
  readonly channels: Map<string, ChannelStore>
  readonly activeChannel: ComputedRef<ChannelStore>

  // ── Navigation ───────────────────────────────────────────────────────
  setDocument(doc: EditorDocument): void
  setActiveChannel(channelId: string): void
  setChannel(channelId: string, channel: Channel): void

  // ── Scoped events ────────────────────────────────────────────────────
  onActiveTranslation<K extends TurnEventKey>(
    event: K,
    handler: (payload: EditorEventMap[K]) => void,
  ): () => void

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
