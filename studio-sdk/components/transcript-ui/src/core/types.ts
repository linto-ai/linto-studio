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
  "speaker:remove": { speakerId: string }
  "scroll:top": { translationId: string }
  "translation:sync": { translationId: string }
  "channel:sync": { channelId: string }
  "channel:reset": { channelId: string }
  "watermark:display": { display: boolean }
  "watermark:pin": { pinned: boolean }
  "llmService:regenerate": { id: string }
  "llmService:export": { id: string }
  "llmService:active": { id: string | null }
  "llmService:selectVersion": { id: string; versionNumber: number }
  "llmService:saveVersion": { id: string; content: string }
  "llmService:selectGeneration": { id: string; generationId: string }
  "verbatim:export": { format: string }
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
  /** Epoch ms — last time the transcription was modified (host-pushed). */
  readonly lastModifiedAt: Ref<number | null>
  setLastModifiedAt(ts: number | null): void
  addTurn(turn: Turn): void
  prependTurns(turns: Turn[]): void
  updateTurn(turnId: string, patch: Partial<Turn>): void
  removeTurn(turnId: string): void
  updateWords(turnId: string, words: Word[]): void
  setTurns(turns: Turn[]): void
  replaceTurns(turns: Turn[]): void
  updateOrCreateTurnSilent(turn: Turn): void
  hasTurn(turnId: string): boolean
  getTurn(turnId: string): Turn | undefined
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
  updateOrCreate(speaker: Speaker): void
  delete(speakerId: string): void
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
  /** ID du mot en cours de lecture (null si pas de timestamps de mots ou pas en lecture). */
  activeWordId: Ref<string | null>
  /** ID du turn en cours de lecture (null si hors plage ou pas en lecture). */
  activeTurnId: Ref<string | null>
  seekTo(time: number): void
  setSeekHandler(handler: ((time: number) => void) | null): void
  pause(): void
  setPauseHandler(handler: (() => void) | null): void
}

// ── Transcription Editor Plugin API (TipTap rich-text editing) ──────────

export interface YjsUser {
  clientId: number
  [key: string]: unknown
}

export interface TranscriptionEditorPluginApi {
  readonly tiptapEditor: ShallowRef<import("@tiptap/vue-3").Editor | undefined>
  readonly doc: import("yjs").Doc | null
  readonly fragment: import("yjs").XmlFragment | null
  readonly speakersMap: import("yjs").Map<{ name: string; color?: string }> | null
  readonly users: Ref<YjsUser[]>
  readonly isConnected: Ref<boolean>
  updateUser(attrs: Record<string, unknown>): void
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

// ── LLM Services Plugin API ─────────────────────────────────────────────

export type LLMServiceStatus =
  | "idle"
  | "queued"
  | "processing"
  | "complete"
  | "error"

export interface LLMServiceVersion {
  versionNumber: number
  createdAt: number
}

export type LLMServiceGenerationStatus =
  | "completed"
  | "error"
  | "processing"
  | "queued"

export interface LLMServiceGeneration {
  generationId: string
  createdAt: number
  status: LLMServiceGenerationStatus
}

export interface LLMServiceInit {
  id: string
  label: string
  description?: string
  content?: string
  status?: LLMServiceStatus
  progress?: number
  phase?: string | null
  error?: string | null
  lastUpdate?: number | null
  versions?: LLMServiceVersion[]
  activeVersionNumber?: number | null
  generations?: LLMServiceGeneration[]
  currentGenerationId?: string | null
}

export interface LLMService {
  readonly id: string
  readonly label: Ref<string>
  readonly description: Ref<string | null>
  readonly content: Ref<string>
  readonly status: Ref<LLMServiceStatus>
  readonly progress: Ref<number>
  readonly phase: Ref<string | null>
  readonly error: Ref<string | null>
  readonly lastUpdate: Ref<number | null>
  readonly versions: Ref<LLMServiceVersion[]>
  readonly activeVersionNumber: Ref<number | null>
  readonly generations: Ref<LLMServiceGeneration[]>
  readonly currentGenerationId: Ref<string | null>
  readonly busy: Ref<boolean>
  readonly dirty: Ref<boolean>
}

export interface LLMServicesPluginApi {
  readonly list: Ref<LLMService[]>
  readonly activeId: Ref<string | null>
  readonly active: ComputedRef<LLMService | null>

  setActive(id: string | null): void

  register(init: LLMServiceInit): LLMService
  unregister(id: string): void
  clear(): void
  get(id: string): LLMService | undefined

  setLabel(id: string, label: string): void
  setStatus(id: string, status: LLMServiceStatus): void
  setProgress(id: string, percentage: number, phase?: string | null): void
  setContent(id: string, content: string, lastUpdate?: number | null): void
  setError(id: string, error: string | null): void
  setVersions(id: string, versions: LLMServiceVersion[]): void
  setActiveVersion(id: string, versionNumber: number | null): void
  setGenerations(id: string, generations: LLMServiceGeneration[]): void
  setCurrentGeneration(id: string, generationId: string | null): void
  setBusy(id: string, busy: boolean): void
  setDirty(id: string, dirty: boolean): void
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
  startDate?: number
  endDate?: number
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
  readonly date: Ref<string | number | null>
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
  llmServices?: LLMServicesPluginApi

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
